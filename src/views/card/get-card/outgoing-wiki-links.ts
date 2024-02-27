import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { toPossiblyRandomWikiLink } from './to-possibly-random-wiki-link'
import { WikiLink } from '../../../domain/WikiLink'
import { Card } from '../../../domain/card'
import { Queries } from '../../../readmodel'
import { toReferencedTitles } from '../../to-referenced-titles'

type OutgoingWikiLinks = (card: Card)
=> (queries: Queries)
=> ReadonlyArray<WikiLink>

export const outgoingWikiLinks: OutgoingWikiLinks = (card) => (queries) => pipe(
  card,
  toReferencedTitles,
  RA.map(toPossiblyRandomWikiLink(queries)),
  RA.compact,
)

