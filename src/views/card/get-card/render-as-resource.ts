import { ApiLink } from './api-link'
import { Viewmodel } from './viewmodel'
import { WikiLink } from '../../../domain/WikiLink'

type CardResource = {
  type: 'Card',
  title: string,
  content: string,
  updatedAt: string,
  outgoingLinks: ReadonlyArray<WikiLink>,
  links: {
    incoming: ApiLink,
    neighbourhood: ApiLink,
    update?: ApiLink,
    destroy?: ApiLink,
  },
}

type RenderAsResource = (viewmodel: Viewmodel) => CardResource

export const renderAsResource: RenderAsResource = (viewmodel) => ({
  type: 'Card',
  title: viewmodel.card.title,
  content: viewmodel.card.body,
  updatedAt: new Date(viewmodel.card.modifiedAt * 1000).toISOString(),
  outgoingLinks: viewmodel.outgoingLinks,
  links: {
    incoming: { href: `/cards/${viewmodel.card.id}/incoming` },
    neighbourhood: { href: `/cards/${viewmodel.card.id}/neighbourhood` },
    update: { href: `/cards/${viewmodel.card.id}`, method: 'PATCH' },
    destroy: { href: `/cards/${viewmodel.card.id}`, method: 'DELETE' },
  },
})

