import * as O from 'fp-ts/Option'
import * as RM from 'fp-ts/ReadonlyMap'
import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { ReadmodelData } from './readmodel-data'
import { Card } from '../domain/card'

export const lookupCardById = (readmodel: ReadmodelData) => (id: string): O.Option<Card> => pipe(
  readmodel.byId,
  RM.lookup(S.Eq)(id),
)

