import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { Command, ErrorOutcome } from '../../http/index.open'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  data: t.type({
    type: t.literal('collection'),
    id: NonEmptyString,
    attributes: t.type({
      isPrivate: t.boolean,
    }),
  }),
})

type Params = t.TypeOf<typeof paramsCodec>

const send = (cmd: Params) => {
  const client = EventStoreDBClient.connectionString('esdb://eventstore:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000')

  const event = jsonEvent({
    type: 'collection-updated',
    data: {
      collectionId: cmd.data.id,
      attributes: cmd.data.attributes,
    },
  })

  return pipe(
    TE.tryCatch(
      async () => client.appendToStream(`collection.${cmd.data.id}`, event),
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

