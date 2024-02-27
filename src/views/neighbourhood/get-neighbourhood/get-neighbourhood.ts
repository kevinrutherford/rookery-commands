import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { calculateNeighbourhood } from './calculate-neighbourhood'
import { lookupCard } from './lookup-card'
import { renderAsResource } from './render-as-resource'
import { Queries } from '../../../readmodel'
import { View } from '../../view'

export const getNeighbourhood = (queries: Queries): View => (input: unknown) => pipe(
  input,
  lookupCard(queries),
  E.map(calculateNeighbourhood(queries)),
  E.map(renderAsResource),
)
