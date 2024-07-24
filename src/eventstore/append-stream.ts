import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client'
import * as TE from 'fp-ts/TaskEither'
import { ErrorOutcome } from '../http/error-outcome'
import { Eventstore } from '../write-resources/eventstore'

export const appendStream = (client: EventStoreDBClient): Eventstore['appendStream'] => (streamName) => (event) => TE.tryCatch(
  async () => client.appendToStream(streamName, jsonEvent(event)),
  (e): ErrorOutcome => [{
    code: 'conflict',
    title: 'Error appending to event stream',
    detail: JSON.stringify(e),
  }],
)

