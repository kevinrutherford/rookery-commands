import * as E from 'fp-ts/Either'
import { Json } from 'fp-ts/Json'
import { ErrorOutcome } from './error-outcome'

export type View = (input: unknown) => E.Either<ErrorOutcome, Json>

