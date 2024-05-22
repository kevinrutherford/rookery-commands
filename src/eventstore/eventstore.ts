import * as TE from 'fp-ts/TaskEither'
import { DomainEvent } from './domain-event'
import { ErrorOutcome } from '../http/error-outcome'

export type Eventstore = {
  appendStream: (streamName: string) => (event: DomainEvent) => TE.TaskEither<ErrorOutcome, unknown>,
  createStream: (streamName: string) => (event: DomainEvent) => TE.TaskEither<ErrorOutcome, unknown>,
}

