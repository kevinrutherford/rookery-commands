import { CardStoreQueries } from './card-store-queries'
import { CardStoreUpdates } from './card-store-updates'

export type CardRepository = {
  updates: CardStoreUpdates,
  queries: CardStoreQueries,
}

