import { Card } from '../../src/domain/card'
import { toReferencedTitles } from '../../src/views/to-referenced-titles'
import { arbitraryCard } from '../domain/arbitrary-card'

const cardWithBody = (body: Card['body']): Card => ({
  ...arbitraryCard(),
  body,
})

describe('toOutgoingReferences', () => {
  describe('when the body contains no references', () => {
    const result = toReferencedTitles(cardWithBody(''))

    it('finds no references', () => {
      expect(result).toStrictEqual([])
    })
  })

  describe('when the body contains references', () => {
    const result = toReferencedTitles(cardWithBody('xyz [[foo]] xyz [[bar]]'))

    it('finds the references', () => {
      expect(result).toStrictEqual(['foo', 'bar'])
    })
  })

  describe('when the body contains duplicate references', () => {
    const result = toReferencedTitles(cardWithBody('xyz [[foo]] xyz [[foo]]'))

    it('finds the references', () => {
      expect(result).toStrictEqual(['foo'])
    })
  })

  describe('when the body references itself', () => {
    const result = toReferencedTitles({
      ...arbitraryCard(),
      body: '[[fred]] xyz [[jim]]',
      title: 'fred' as Card['title'],
    })

    it('ignores itself', () => {
      expect(result).toStrictEqual(['jim'])
    })
  })
})

