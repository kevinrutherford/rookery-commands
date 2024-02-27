import * as fs from 'fs'
import { promisify } from 'util'
import { sequenceS } from 'fp-ts/Apply'
import * as E from 'fp-ts/Either'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { CardId } from './card-id'
import * as FP from './filepath'
import { Card } from '../domain/card'
import { ErrorOutcome } from '../domain/error-outcome'

const getFileData = (filename: string) => pipe(
  {
    fileContents: pipe(
      TE.tryCatch(
        async () => promisify(fs.readFile)(filename, 'utf8'),
        (e) => {
          const error = E.toError(e)
          if (error.message.match(/.*ENOENT.*/)) {
            return {
              category: 'not-found',
              message: error.message,
              evidence: { filename },
            } as ErrorOutcome
          }
          return {
            category: 'internal-error',
            message: error.message,
            evidence: { filename },
          } as ErrorOutcome
        },
      ),
      T.map(E.chain((json) => E.tryCatch(
        () => JSON.parse(json),
        (e) => {
          const error = E.toError(e)
          return {
            category: 'internal-error',
            message: 'Could not parse JSON file contents',
            evidence: { filename, error: error.message },
          } as ErrorOutcome
        },
      ))),
    ),
    modifiedAt: pipe(
      TE.tryCatch(
        async () => promisify(fs.stat)(filename),
        (e) => {
          const error = E.toError(e)
          if (error.message.match(/.*ENOENT.*/)) {
            return {
              category: 'not-found',
              message: error.message,
              evidence: { filename },
            } as ErrorOutcome
          }
          return {
            category: 'internal-error',
            message: error.message,
            evidence: { filename },
          } as ErrorOutcome
        },
      ),
      TE.map((stats) => new Date(stats.mtimeMs).getTime() / 1000),
    ),
  },
  sequenceS(TE.ApplyPar),
)

export const lookup = (pageId: string): TE.TaskEither<ErrorOutcome, Card> => pipe(
  pageId,
  FP.fromPageId,
  getFileData,
  TE.map((data) => ({
    id: pageId as CardId,
    title: data.fileContents.title,
    body: data.fileContents.content,
    modifiedAt: data.modifiedAt,
  })),
)

