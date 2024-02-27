import { allCards } from './all-cards'
import { cardCreated } from './card-created'
import { cardDestroyed } from './card-destroyed'
import { cardUpdated } from './card-updated'
import { lookupCardById } from './lookup-card-by-id'
import { lookupCardByTitle } from './lookup-card-by-title'
import { selectRandomCard } from './select-random-card'

type Commands = {
  create: ReturnType<typeof cardCreated>,
  destroy: ReturnType<typeof cardDestroyed>,
  update: ReturnType<typeof cardUpdated>,
}

export type Queries = {
  allCards: ReturnType<typeof allCards>,
  lookupCardById: ReturnType<typeof lookupCardById>,
  lookupCardByTitle: ReturnType<typeof lookupCardByTitle>,
  selectRandomCard: ReturnType<typeof selectRandomCard>,
}

export type Readmodel = {
  commands: Commands,
  queries: Queries,
}

