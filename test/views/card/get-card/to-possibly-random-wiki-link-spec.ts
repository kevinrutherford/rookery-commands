import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { Card } from '../../../../src/domain/card'
import * as rm from '../../../../src/readmodel'
import { toPossiblyRandomWikiLink } from '../../../../src/views/card/get-card/to-possibly-random-wiki-link'
import { arbitraryCard } from '../../../domain/arbitrary-card'
import { shouldNotBeCalled } from '../../../should-not-be-called'

const createReadmodelWith = (cards: ReadonlyArray<Card>) => {
  const readmodel = rm.instantiate()
  pipe(
    cards,
    RA.map((card) => readmodel.commands.create(card)),
  )
  return readmodel
}

describe('to-possibly-random-wiki-link', () => {
  describe('given a non-random title request', () => {
    describe('and the card exists', () => {
      const card = arbitraryCard()
      const readmodel = createReadmodelWith([card])
      const link = pipe(
        card.title,
        toPossiblyRandomWikiLink(readmodel.queries),
        O.getOrElseW(shouldNotBeCalled),
      )

      it('returns a link to the card', () => {
        expect(link.title).toStrictEqual(card.title)
        expect(link.url).toContain(card.id)
      })
    })

    describe('and the card does not exist', () => {
      const readmodel = createReadmodelWith([])
      const result = toPossiblyRandomWikiLink(readmodel.queries)(arbitraryCard().title)

      it('returns O.none', () => {
        expect(result).toStrictEqual(O.none)
      })
    })
  })

  describe('given a random title request', () => {
    const card = arbitraryCard()
    const readmodel = createReadmodelWith([card])
    const link = pipe(
      'Random Card',
      toPossiblyRandomWikiLink(readmodel.queries),
      O.getOrElseW(shouldNotBeCalled),
    )

    it('returns a link with title "Random Card"', () => {
      expect(link.title).toBe('Random Card')
      expect(link.url).toContain(card.id)
    })
  })
})
