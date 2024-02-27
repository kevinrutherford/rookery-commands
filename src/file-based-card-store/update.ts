import * as fs from 'fs'
import { promisify } from 'util'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as FP from './filepath'
import { Updates } from './updates'
import { ErrorOutcome } from '../domain/error-outcome'

export const update: Updates['update'] = (pageId, title, body) => pipe(
  pageId,
  FP.fromPageId,
  TE.right,
  TE.chainFirst((filename) => TE.tryCatch(
    async () => promisify(fs.stat)(filename),
    () => ({
      category: 'not-found',
      message: 'Card file not found',
      evidence: { filename },
    }) as ErrorOutcome,
  )),
  TE.chain((filename) => TE.tryCatch(
    async () => promisify(fs.writeFile)(filename, JSON.stringify({
      title,
      content: body,
    })),
    (e) => {
      return {
        category: 'internal-error',
        message: 'Could not write card file',
        evidence: { filename, error: E.toError(e).toString() },
      } as ErrorOutcome
    },
  )),
  TE.map(() => { }),
)

