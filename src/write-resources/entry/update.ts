import { EventStoreDBClient, jsonEvent, JSONEventType, STREAM_EXISTS } from '@eventstore/db-client'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { Command } from '../../http/index.open'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  data: t.type({
    type: t.literal('entry'),
    id: NonEmptyString,
    attributes: t.type({
      frontMatter: t.type({
        title: NonEmptyString,
        abstract: NonEmptyString,
        authors: t.array(NonEmptyString),
      }),
    }),
  }),
})

type Params = t.TypeOf<typeof paramsCodec>

type FrontMatterAddedEventData = Params['data']['attributes']

type SomeEvent = JSONEventType<'front-matter-added', FrontMatterAddedEventData>

const send = (cmd: Params): TE.TaskEither<unknown, unknown> => {
  const client = EventStoreDBClient.connectionString('esdb://eventstore:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000')

  const event = jsonEvent<SomeEvent>({
    type: 'front-matter-added',
    data: cmd.data.attributes,
  })

  return pipe(
    T.of(client.appendToStream(`entry.${cmd.data.id}`, event, { expectedRevision: STREAM_EXISTS })),
    TE.rightTask,
  )
}

type Update = () => Command

export const update: Update = () => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.map(send),
  TE.map(() => ({})),
)

