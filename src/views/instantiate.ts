import { constructRoot } from './box/construct-root'
import { listMissingCards } from './box/list-missing-cards'
import { listOrphanCards } from './box/orphans'
import { buildRecentChanges } from './box/recent-changes'
import { search } from './box/search'
import { getCard } from './card/get-card'
import { incomingLinks } from './card/incoming-links'
import { getNeighbourhood } from './neighbourhood/get-neighbourhood'
import { View } from './view'
import { Readmodel } from '../readmodel'

export type Views = {
  buildRecentChanges: View,
  listMissingCards: View,
  listOrphanCards: View,
  search: View,
  getCard: View,
  incomingLinks: View,
  constructNeighbourhood: View,
  root: View,
}

export const instantiate = (readmodel: Readmodel): Views => ({
  buildRecentChanges: buildRecentChanges(readmodel.queries),
  listMissingCards: listMissingCards(readmodel.queries),
  listOrphanCards: listOrphanCards(readmodel.queries),
  search: search(readmodel.queries),
  getCard: getCard(readmodel.queries),
  incomingLinks: incomingLinks(readmodel.queries),
  constructNeighbourhood: getNeighbourhood(readmodel.queries),
  root: constructRoot,
})
