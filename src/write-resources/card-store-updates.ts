import * as TE from 'fp-ts/TaskEither'
import { Card } from '../domain/card'
import { ErrorOutcome } from '../domain/error-outcome'

export type CardStoreUpdates = {
  create: (title: string, body: string) => TE.TaskEither<ErrorOutcome, Card>,
  destroy: (id: string) => TE.TaskEither<ErrorOutcome, void>,
  update: (id: string, title: string, body: string) => TE.TaskEither<ErrorOutcome, void>,
}

