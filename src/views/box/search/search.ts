import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import * as tt from 'io-ts-types'
import { findMatches } from './find-matches'
import { toWikiLink } from '../../../domain/WikiLink'
import { Card } from '../../../domain/card'
import { Queries } from '../../../readmodel'
import { validateInput } from '../../validate-input'
import { View } from '../../view'

const renderAsResource = (cards: ReadonlyArray<Card>) => ({
  type: 'TitleSearchResults',
  pages: RA.map(toWikiLink)(cards),
})

const searchParams = t.type({
  query: tt.NonEmptyString,
})

export const search = (queries: Queries): View => (input) => pipe(
  input,
  validateInput(searchParams),
  E.map((params) => params.query),
  E.chain(findMatches(queries)),
  E.map(renderAsResource),
)

