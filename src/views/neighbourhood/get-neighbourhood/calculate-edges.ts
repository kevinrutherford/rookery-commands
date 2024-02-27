import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { Edge } from './neighbourhood'
import { Card } from '../../../domain/card'
import { toReferencedTitles } from '../../to-referenced-titles'

const toEdge = (card: Card, parish: ReadonlyArray<Card>) => (title: Card['title']): O.Option<Edge> => pipe(
  parish,
  RA.findFirst((node) => node.title === title),
  O.map((node) => ({
    source: card.id,
    target: node.id,
  })),
)

const findEdgesToExistingCards = (parish: ReadonlyArray<Card>) => (card: Card): ReadonlyArray<Edge> => pipe(
  card,
  toReferencedTitles,
  RA.map(toEdge(card, parish)),
  RA.compact,
)

export const calculateEdges = (parish: ReadonlyArray<Card>): ReadonlyArray<Edge> => pipe(
  parish,
  RA.chain(findEdgesToExistingCards(parish)),
)

