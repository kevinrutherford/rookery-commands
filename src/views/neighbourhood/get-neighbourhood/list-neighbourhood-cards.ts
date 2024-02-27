import * as Eq from 'fp-ts/Eq'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { selectCardsByTitle } from './select-cards-by-title'
import { Card } from '../../../domain/card'
import { Queries } from '../../../readmodel'
import { findReferencingCards } from '../../find-referencing-cards'
import { toReferencedTitles } from '../../to-referenced-titles'

const eqCard: Eq.Eq<Card> = pipe(
  S.Eq,
  Eq.contramap((card) => card.id),
)

type ListNeighbourhoodCards = (queries: Queries)
=> (centreCard: Card)
=> ReadonlyArray<Card>

export const listNeighbourhoodCards: ListNeighbourhoodCards = (queries) => (centreCard) => pipe(
  {
    cardsReferencingMe: findReferencingCards(queries)(centreCard),
    cardsIReference: pipe(
      centreCard,
      toReferencedTitles,
      selectCardsByTitle(queries),
    ),
  },
  (context) => [
    centreCard,
    ...context.cardsIReference,
    ...context.cardsReferencingMe,
  ],
  RA.uniq(eqCard),
)

