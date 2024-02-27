import { arbitraryCard } from './arbitrary-card'
import * as WL from '../../src/domain/WikiLink'

describe('WikiLink', () => {
  describe('create', () => {
    const card = arbitraryCard()
    const link = WL.create(card.id, card.title)

    it('includes the correct title', () => {
      expect(link.title).toStrictEqual(card.title)
    })

    it('includes the id in the URL', () => {
      expect(link.url).toMatch(card.id)
    })
  })
})
