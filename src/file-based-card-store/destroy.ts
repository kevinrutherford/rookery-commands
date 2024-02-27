import * as fs from 'fs'
import { promisify } from 'util'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as FP from './filepath'
import { Updates } from './updates'
import { ErrorOutcome } from '../domain/error-outcome'

export const destroy: Updates['destroy'] = (pageId) => pipe(
  pageId,
  FP.fromPageId,
  (filename) => TE.tryCatch(
    async () => promisify(fs.unlink)(filename),
    (e) => {
      return {
        category: 'internal-error',
        message: 'Could not delete card file',
        evidence: { filename, error: E.toError(e).toString() },
      } as ErrorOutcome
    },
  ),
  TE.map(() => { }),
)

