import { ReadmodelData } from './readmodel-data'
import { Card } from '../domain/card'

export const cardCreated = (data: ReadmodelData) => (card: Card): Card => {
  data.byId.set(card.id, card)
  data.byTitle.set(card.title, card)
  return card
}

