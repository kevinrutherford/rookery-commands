import * as fs from 'fs'
import { promisify } from 'util'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as CI from './card-id'
import * as FP from './filepath'
import { Updates } from './updates'
import * as WL from '../domain/WikiLink'
import { ErrorOutcome } from '../domain/error-outcome'

export const create: Updates['create'] = (title, body) => pipe(
  CI.generate(),
  (pageId) => pipe(
    pageId,
    FP.fromPageId,
    (f) => TE.tryCatch( // TODO: check for existence first
      async () => promisify(fs.writeFile)(f, JSON.stringify({
        title,
        content: body,
      })),
      (e) => {
        return {
          category: 'internal-error',
          message: 'Could not create card file',
          evidence: { filename: f, error: E.toError(e).toString() },
        } as ErrorOutcome
      },
    ),
    TE.map(() => ({
      id: pageId,
      title,
      body,
      link: WL.create(pageId, title),
      modifiedAt: Date.now(),
    })),
  ),
)

