import { ReadmodelData } from './readmodel-data'
import { Card } from '../domain/card'

export const cardUpdated = (data: ReadmodelData) => (updatedCard: Card): void => {
  const originalCard = data.byId.get(updatedCard.id)
  if (originalCard && originalCard.id == updatedCard.id) {
    data.byId.set(originalCard.id, updatedCard)
    data.byTitle.delete(originalCard.title)
    data.byTitle.set(updatedCard.title, updatedCard)
  }
}

