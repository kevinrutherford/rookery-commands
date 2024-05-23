import { EventStoreDBClient } from '@eventstore/db-client'
import { appendStream } from './append-stream'
import { createStream } from './create-stream'
import { Eventstore } from '../write-resources/eventstore'

export const instantiate = (): Eventstore => {
  const client = EventStoreDBClient.connectionString('esdb://eventstore:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000')
  return ({
    appendStream: appendStream(client),
    createStream: createStream(client),
  })
}

