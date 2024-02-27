import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { allCardIds } from './all-card-ids'
import { lookup } from './lookup'
import { Queries } from './queries'

export const listAll: Queries['listAll'] = () => pipe(
  allCardIds(),
  TE.chain(TE.traverseArray(lookup)),
)

