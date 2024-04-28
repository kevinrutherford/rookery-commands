import { EventStoreDBClient, jsonEvent, JSONType, NO_STREAM } from '@eventstore/db-client'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { ErrorOutcome } from '../http/error-outcome'

const toErrorOutcome = (error: Error): ErrorOutcome => ([{
  title: error.toString(),
}])

type EventDefinition = {
  type: string,
  data: JSONType,
}

export const createStream = (streamName: string) => (event: EventDefinition): TE.TaskEither<ErrorOutcome, unknown> => {
  const client = EventStoreDBClient.connectionString('esdb://eventstore:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000')
  return pipe(
    TE.tryCatch(
      async () => client.appendToStream(streamName, jsonEvent(event), { expectedRevision: NO_STREAM }),
      E.toError,
    ),
    TE.mapLeft(toErrorOutcome),
  )
}

