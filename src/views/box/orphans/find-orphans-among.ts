import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { Card } from '../../../domain/card'

type FindOrphansAmong = (allCards: ReadonlyArray<Card>)
=> (allMentions: ReadonlyArray<Card['title']>)
=> ReadonlyArray<Card>

export const findOrphansAmong: FindOrphansAmong = (allCards) => (allMentions) => pipe(
  allCards,
  RA.filter((card) => !allMentions.includes(card.title)),
)

