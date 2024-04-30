import { EventStoreDBClient, jsonEvent, JSONEventType } from '@eventstore/db-client'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { Command, ErrorOutcome } from '../../http/index.open'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  data: t.type({
    type: t.literal('work'),
    id: NonEmptyString,
    attributes: t.union([
      t.type({
        crossrefStatus: t.literal('not-determined'),
        reason: t.union([t.literal('response-unavailable'), t.literal('response-invalid')]),
      }),
      t.type({ crossrefStatus: t.literal('not-found') }),
      t.type({
        crossrefStatus: t.literal('found'),
        title: NonEmptyString,
        abstract: NonEmptyString,
        authors: t.array(NonEmptyString),
      }),
    ]),
  }),
})

type Params = t.TypeOf<typeof paramsCodec>

type WorkUpdatedEventData = {
  workId: string,
  attributes: Params['data']['attributes'],
}

type SomeEvent = JSONEventType<'work-updated', WorkUpdatedEventData>

const send = (cmd: Params) => {
  const client = EventStoreDBClient.connectionString('esdb://eventstore:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000')

  const event = jsonEvent<SomeEvent>({
    type: 'work-updated',
    data: {
      workId: cmd.data.id,
      attributes: cmd.data.attributes,
    },
  })

  return pipe(
    TE.tryCatch(
      async () => client.appendToStream(`work.${cmd.data.id}`, event),
      (e): ErrorOutcome => [{
        title: 'Error appending to event stream',
        detail: JSON.stringify(e),
      }],
    ),
  )
}

type Update = () => Command

export const update: Update = () => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.chain(send),
  TE.map(() => ({})),
)

