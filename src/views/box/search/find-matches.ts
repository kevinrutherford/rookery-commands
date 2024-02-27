import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { Card } from '../../../domain/card'
import { Queries } from '../../../readmodel'
import { ErrorOutcome } from '../../error-outcome'

const includesTextOrTitle = (query: string) => (card: Card) => (
  card.title.toLowerCase().includes(query.toLowerCase())
  || card.body.toLowerCase().includes(query.toLowerCase())
)

type FindMatches = (queries: Queries)
=> (query: string)
=> E.Either<ErrorOutcome, ReadonlyArray<Card>>

export const findMatches: FindMatches = (queries) => (query) => pipe(
  queries.allCards(),
  RA.filter(includesTextOrTitle(query)),
  E.right,
)

