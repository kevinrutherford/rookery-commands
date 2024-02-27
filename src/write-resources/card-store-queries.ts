import * as TE from 'fp-ts/TaskEither'
import { Card } from '../domain/card'
import { ErrorOutcome } from '../domain/error-outcome'

export type CardStoreQueries = {
  listAll: () => TE.TaskEither<ErrorOutcome, ReadonlyArray<Card>>,
}

