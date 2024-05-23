import { Json } from 'fp-ts/Json'
import * as TE from 'fp-ts/TaskEither'
import { ErrorOutcome } from './error-outcome'
import { Eventstore } from '../write-resources/eventstore'

export type Command = (input: unknown) => TE.TaskEither<ErrorOutcome, Json>

export type CommandHandler = (eventstore: Eventstore) => Command

