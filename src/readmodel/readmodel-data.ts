import { Card } from '../domain/card'

export type ReadmodelData = {
  byId: Map<Card['id'], Card>,
  byTitle: Map<Card['title'], Card>,
}

