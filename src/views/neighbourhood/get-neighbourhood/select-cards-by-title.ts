import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { Card } from '../../../domain/card'
import { Queries } from '../../../readmodel'

type SelectCardsByTitle = (queries: Queries)
=> (titles: ReadonlyArray<Card['title']>)
=> ReadonlyArray<Card>

export const selectCardsByTitle: SelectCardsByTitle = (queries) => (titles) => pipe(
  queries.allCards(),
  RA.filter((card) => titles.includes(card.title)),
)

