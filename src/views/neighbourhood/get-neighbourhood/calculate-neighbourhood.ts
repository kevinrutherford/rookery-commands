import { pipe } from 'fp-ts/function'
import { calculateEdges } from './calculate-edges'
import { listNeighbourhoodCards } from './list-neighbourhood-cards'
import { Neighbourhood } from './neighbourhood'
import { Card } from '../../../domain/card'
import { Queries } from '../../../readmodel'

type CalculateNeighbourhood = (queries: Queries) => (centreCard: Card) => Neighbourhood

export const calculateNeighbourhood: CalculateNeighbourhood = (queries) => (centreCard) => pipe(
  centreCard,
  listNeighbourhoodCards(queries),
  (cards) => ({
    nodes: cards,
    edges: calculateEdges(cards),
  }),
)

