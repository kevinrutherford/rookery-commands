import { EventStoreDBClient, jsonEvent, NO_STREAM } from '@eventstore/db-client'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { Eventstore } from './eventstore'

export const createStream: Eventstore['createStream'] = (streamName) => (event) => {
  const client = EventStoreDBClient.connectionString('esdb://eventstore:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000')
  return pipe(
    TE.tryCatch(
      async () => client.appendToStream(streamName, jsonEvent(event), { expectedRevision: NO_STREAM }),
      () => ([{
        title: 'Unknown error from EventStore',
      }]),
    ),
  )
}

