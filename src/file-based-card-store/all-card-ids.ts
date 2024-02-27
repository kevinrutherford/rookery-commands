import * as fs from 'fs'
import { promisify } from 'util'
import * as E from 'fp-ts/Either'
import * as A from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { CardId } from './card-id'
import { toPageId } from './filepath'
import { ErrorOutcome } from '../domain/error-outcome'

const databaseRoot = process.env.DATABASE_ROOT ?? '' // TODO
const folder = `${databaseRoot}/pages`

export const allCardIds = (): TE.TaskEither<ErrorOutcome, ReadonlyArray<CardId>> => pipe(
  TE.tryCatch(
    async () => promisify(fs.readdir)(folder),
    (e) => {
      const error = E.toError(e)
      return {
        category: 'internal-error',
        message: error.message,
        evidence: { folder },
      } as ErrorOutcome
    },
  ),
  TE.map(A.filter((f) => f.endsWith('.page.json'))),
  TE.map(A.map(toPageId)),
)

