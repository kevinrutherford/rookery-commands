import * as E from 'fp-ts/Either'
import * as Ord from 'fp-ts/Ord'
import * as A from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { toWikiLink } from '../../domain/WikiLink'
import { Card } from '../../domain/card'
import { Queries } from '../../readmodel'
import { View } from '../view'

const toRecentChange = (card: Card) => ({
  link: toWikiLink(card),
  modified: card.modifiedAt,
})

const byDateDescending = pipe(
  N.Ord,
  Ord.contramap((card: Card) => card.modifiedAt),
  Ord.reverse,
)

export const buildRecentChanges = (queries: Queries): View => () => pipe(
  queries.allCards(),
  A.sort(byDateDescending),
  A.takeLeft(20), // TODO: connascence with the client
  A.map(toRecentChange),
  (pages) => ({
    type: 'RecentChanges',
    pages,
  }),
  E.right,
)

