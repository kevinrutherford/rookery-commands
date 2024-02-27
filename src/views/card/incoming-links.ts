import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { findIncomingLinks } from './find-incoming-links'
import { Queries } from '../../readmodel'
import { ErrorOutcome } from '../error-outcome'
import { validateInput } from '../validate-input'
import { View } from '../view'

const params = t.type({
  cardid: t.string,
})

export const incomingLinks = (queries: Queries): View => (input: unknown) => pipe(
  input,
  validateInput(params),
  E.map((p) => p.cardid),
  E.chain((id) => pipe(
    id,
    queries.lookupCardById,
    E.fromOption(() => ({
      category: 'not-found',
      message: 'card not found',
      evidence: { id },
    }) as ErrorOutcome),
  )),
  E.map(findIncomingLinks(queries)),
  E.map((links) => ({
    type: 'Incoming',
    pages: links,
  })),
)

