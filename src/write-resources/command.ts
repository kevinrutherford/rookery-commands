import { Json } from 'fp-ts/Json'
import * as TE from 'fp-ts/TaskEither'
import { ErrorOutcome } from '../domain/error-outcome'

export type Command = (input: unknown) => TE.TaskEither<ErrorOutcome, Json>

