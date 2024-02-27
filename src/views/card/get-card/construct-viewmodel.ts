import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { outgoingWikiLinks } from './outgoing-wiki-links'
import { Viewmodel } from './viewmodel'
import { Queries } from '../../../readmodel'
import { ErrorOutcome } from '../../error-outcome'

type ConstructViewmodel = (queries: Queries)
=> (cardId: string)
=> E.Either<ErrorOutcome, Viewmodel>

export const constructViewmodel: ConstructViewmodel = (queries) => (cardId) => pipe(
  cardId,
  queries.lookupCardById,
  E.fromOption(() => ({
    category: 'not-found',
    message: 'card not found',
    evidence: { cardId },
  }) as ErrorOutcome),
  E.map((card) => pipe(
    outgoingWikiLinks(card)(queries),
    (outgoingLinks) => ({
      card,
      outgoingLinks,
    }),
  )),
)

