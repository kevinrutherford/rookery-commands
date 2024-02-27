import * as A from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { Card } from '../domain/card'
import { Queries } from '../readmodel'

type FindReferencingCards = (queries: Queries)
=> (card: Card)
=> ReadonlyArray<Card>

export const findReferencingCards: FindReferencingCards = (queries) => (card) => pipe(
  queries.allCards(),
  A.filter((p) => p.body.includes(`[[${card.title}]]`)),
)

