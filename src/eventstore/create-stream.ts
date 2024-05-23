import { EventStoreDBClient, jsonEvent, NO_STREAM } from '@eventstore/db-client'
import * as TE from 'fp-ts/TaskEither'
import { Eventstore } from '../write-resources/eventstore'

export const createStream = (client: EventStoreDBClient): Eventstore['appendStream'] => (streamName) => (event) => TE.tryCatch(
  async () => client.appendToStream(streamName, jsonEvent(event), { expectedRevision: NO_STREAM }),
  () => ([{
    title: 'Unknown error from EventStore',
  }]),
)

