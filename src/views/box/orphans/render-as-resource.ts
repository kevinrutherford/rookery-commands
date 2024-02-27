import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { toWikiLink, WikiLink } from '../../../domain/WikiLink'
import { Card } from '../../../domain/card'

type OrphansResource = {
  type: 'Orphans',
  pages: ReadonlyArray<WikiLink>,
}

export const renderAsResource = (cards: ReadonlyArray<Card>): OrphansResource => ({
  type: 'Orphans',
  pages: pipe(
    cards,
    RA.map(toWikiLink),
  ),
})

