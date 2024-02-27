import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import * as WL from '../../../domain/WikiLink'
import { Card } from '../../../domain/card'
import { Queries } from '../../../readmodel'

export const toPossiblyRandomWikiLink = (queries: Queries) => (title: Card['title']): O.Option<WL.WikiLink> => pipe(
  (title === 'Random Card')
    ? queries.selectRandomCard()
    : queries.lookupCardByTitle(title),
  O.map((c) => WL.create(c.id, title)),
)

