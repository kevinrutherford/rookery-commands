import { Card } from './card'

export type WikiLink = {
  title: Card['title'],
  url: string,
}

export const create = (id: Card['id'], title: WikiLink['title']): WikiLink => ({
  title,
  url: `/cards/${id}`,
})

export const toWikiLink = (card: Card): WikiLink => create(card.id, card.title)

