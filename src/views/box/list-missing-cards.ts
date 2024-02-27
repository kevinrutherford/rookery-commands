import * as E from 'fp-ts/Either'
import * as Ord from 'fp-ts/Ord'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { toWikiLink, WikiLink } from '../../domain/WikiLink'
import { Queries } from '../../readmodel'
import { toReferencedTitles } from '../to-referenced-titles'
import { View } from '../view'

type MissingPage = {
  title: string,
  linkedFrom: WikiLink,
}

const byTitleAscending = pipe(
  S.Ord,
  Ord.contramap((page: MissingPage) => page.title),
)

export const listMissingCards = (queries: Queries): View => () => pipe(
  queries.allCards(),
  (allCards) => ({
    allTitles: pipe(
      allCards,
      RA.map((page) => page.title),
    ),
    allReferences: pipe(
      allCards,
      RA.chain((card) => pipe(
        card,
        toReferencedTitles,
        RA.map((ref) => ({
          title: ref,
          linkedFrom: toWikiLink(card),
        })),
      )),
      RA.sort(byTitleAscending),
    ),
  }),
  ({ allTitles, allReferences }) => pipe(
    allReferences,
    RA.filter((ref) => !allTitles.includes(ref.title)),
    (missingPages) => ({
      type: 'MissingPages',
      missingPages,
    }),
  ),
  E.right,
)

