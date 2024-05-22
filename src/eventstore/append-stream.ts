import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client'
import * as TE from 'fp-ts/TaskEither'
import { Eventstore } from './eventstore'
import { ErrorOutcome } from '../http/error-outcome'

export const appendStream: Eventstore['appendStream'] = (streamName) => (event) => {
  const client = EventStoreDBClient.connectionString('esdb://eventstore:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000')

  return TE.tryCatch(
    async () => client.appendToStream(streamName, jsonEvent(event)),
    (e): ErrorOutcome => [{
      title: 'Error appending to event stream',
      detail: JSON.stringify(e),
    }],
  )
}

