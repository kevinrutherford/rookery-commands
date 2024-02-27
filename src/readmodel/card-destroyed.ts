import { ReadmodelData } from './readmodel-data'

export const cardDestroyed = (data: ReadmodelData) => (id: string): void => {
  const card = data.byId.get(id)
  if (card) {
    data.byId.delete(card.id)
    data.byTitle.delete(card.title)
  }
}

