import { EventStoreDBClient, jsonEvent, JSONEventType, NO_STREAM } from '@eventstore/db-client'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { Command } from '../../http/index.open'
import { validateInput } from '../validate-input'

type CommentCreatedEvent = {
  id: string,
  entryId: string,
  content: string,
}

const paramsCodec = t.type({
  id: NonEmptyString,
  entryId: NonEmptyString,
  content: NonEmptyString,
})

type Params = t.TypeOf<typeof paramsCodec>

type SomeEvent = JSONEventType<'comment-created', CommentCreatedEvent>

const send = (cmd: Params): TE.TaskEither<unknown, unknown> => {
  const client = EventStoreDBClient.connectionString('esdb://eventstore:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000')

  const event = jsonEvent<SomeEvent>({
    type: 'comment-created',
    data: cmd,
  })

  return pipe(
    T.of(client.appendToStream(`comment.${event.data.id}`, event, { expectedRevision: NO_STREAM })),
    TE.rightTask,
  )
}

type Create = () => Command

export const create: Create = () => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.map(send),
  TE.map(() => ({})),
)

