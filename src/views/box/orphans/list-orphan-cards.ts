import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { calculateOrphans } from './calculate-orphans'
import { renderAsResource } from './render-as-resource'
import { Queries } from '../../../readmodel'
import { View } from '../../view'

export const listOrphanCards = (queries: Queries): View => () => pipe(
  queries.allCards(),
  calculateOrphans,
  renderAsResource,
  E.right,
)

