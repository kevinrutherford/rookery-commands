import { ReadmodelData } from './readmodel-data'
import { Card } from '../domain/card'

export const allCards = (readmodel: ReadmodelData) => (): ReadonlyArray<Card> => (
  Array.from(readmodel.byId.values())
)

