import { EventData, EventStoreDBClient, NO_STREAM } from '@eventstore/db-client'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'

export const createStream = (streamName: string, event: EventData): TE.TaskEither<unknown, unknown> => {
  const client = EventStoreDBClient.connectionString('esdb://eventstore:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000')
  return pipe(
    T.of(client.appendToStream(streamName, event, { expectedRevision: NO_STREAM })),
    TE.rightTask,
  )
}

