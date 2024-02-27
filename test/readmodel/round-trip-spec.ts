import * as O from 'fp-ts/Option'
import { Card } from '../../src/domain/card'
import * as rm from '../../src/readmodel'
import { arbitraryCard } from '../domain/arbitrary-card'
import { arbitraryString } from '../helpers'

describe('readmodel', () => {
  describe('when a card is created', () => {
    const card = arbitraryCard()
    const readmodel = rm.instantiate()

    beforeEach(() => {
      readmodel.commands.create(card)
    })

    it('can be looked up by id', () => {
      expect(readmodel.queries.lookupCardById(card.id)).toStrictEqual(O.some(card))
    })

    it('can be looked up by title', () => {
      expect(readmodel.queries.lookupCardByTitle(card.title)).toStrictEqual(O.some(card))
    })

    it('appears in the list of all cards', () => {
      expect(readmodel.queries.allCards()).toHaveLength(1)
    })
  })

  describe('when a card\'s body is updated', () => {
    const originalCard = arbitraryCard()
    const newBody = arbitraryString() as Card['body']
    const readmodel = rm.instantiate()
    let result: ReturnType<rm.Queries['lookupCardByTitle']>

    beforeEach(() => {
      readmodel.commands.create(originalCard)
      readmodel.commands.update({
        ...originalCard,
        body: newBody,
      })
      result = readmodel.queries.lookupCardByTitle(originalCard.title)
    })

    it('has the new content when retreived', () => {
      expect(result).toStrictEqual(O.some(expect.objectContaining({
        id: originalCard.id,
        title: originalCard.title,
        body: newBody,
      })))
    })
  })

  describe('when a card\'s title is updated', () => {
    const originalCard = arbitraryCard()
    const newTitle = arbitraryString() as Card['title']
    const readmodel = rm.instantiate()

    beforeEach(() => {
      readmodel.commands.create(originalCard)
      readmodel.commands.update({
        ...originalCard,
        title: newTitle,
      })
    })

    it('can be retrieved using the new title', () => {
      expect(readmodel.queries.lookupCardByTitle(newTitle)).toStrictEqual(O.some(expect.objectContaining({
        id: originalCard.id,
        title: newTitle,
        body: originalCard.body,
      })))
    })

    it('cannot be retrieved using the old title', () => {
      expect(readmodel.queries.lookupCardByTitle(originalCard.title)).toStrictEqual(O.none)
    })
  })

  describe('when a card is deleted', () => {
    const card = arbitraryCard()
    const readmodel = rm.instantiate()
    let result: ReturnType<rm.Queries['lookupCardByTitle']>

    beforeEach(() => {
      readmodel.commands.create(card)
      readmodel.commands.destroy(card.id)
      result = readmodel.queries.lookupCardByTitle(card.title)
    })

    it('can no longer be looked up', () => {
      expect(result).toStrictEqual(O.none)
    })
  })
})
