import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { Card } from '../domain/card'

export const toReferencedTitles = (card: Card): ReadonlyArray<Card['title']> => pipe(
  card.body.match(/\[\[[^\]]+\]\]/gi) ?? [],
  RA.map((markup) => markup.replace(/\[|\]/g, '')),
  RA.filter((title) => title !== card.title),
  RA.uniq(S.Eq),
)

