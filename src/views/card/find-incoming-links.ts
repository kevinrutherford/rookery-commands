import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { toWikiLink, WikiLink } from '../../domain/WikiLink'
import { Card } from '../../domain/card'
import { Queries } from '../../readmodel'
import { findReferencingCards } from '../find-referencing-cards'

type FindIncomingLinks = (queries: Queries)
=> (card: Card)
=> ReadonlyArray<WikiLink>

export const findIncomingLinks: FindIncomingLinks = (queries) => (card) => pipe(
  card,
  findReferencingCards(queries),
  RA.map(toWikiLink),
)

