import { WikiLink } from '../../../domain/WikiLink'
import { Card } from '../../../domain/card'

export type Viewmodel = {
  card: Card,
  outgoingLinks: ReadonlyArray<WikiLink>,
}

