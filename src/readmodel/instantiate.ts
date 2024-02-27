import { allCards } from './all-cards'
import { cardCreated } from './card-created'
import { cardDestroyed } from './card-destroyed'
import { cardUpdated } from './card-updated'
import { lookupCardById } from './lookup-card-by-id'
import { lookupCardByTitle } from './lookup-card-by-title'
import { Readmodel } from './readmodel'
import { selectRandomCard } from './select-random-card'

export const instantiate = (): Readmodel => {
  const data = {
    byId: new Map(),
    byTitle: new Map(),
  }
  return {
    commands: {
      create: cardCreated(data),
      destroy: cardDestroyed(data),
      update: cardUpdated(data),
    },
    queries: {
      allCards: allCards(data),
      lookupCardById: lookupCardById(data),
      lookupCardByTitle: lookupCardByTitle(data),
      selectRandomCard: selectRandomCard(data),
    },
  }
}

