import { pipe } from 'fp-ts/function'
import * as rm from '../../../../src/readmodel'
import { calculateNeighbourhood } from '../../../../src/views/neighbourhood/get-neighbourhood/calculate-neighbourhood'
import { Neighbourhood } from '../../../../src/views/neighbourhood/get-neighbourhood/neighbourhood'
import { arbitraryCard } from '../../../domain/arbitrary-card'

describe('calculate-neighbourhood', () => {
  const centreCard = arbitraryCard()

  describe('when the centre card has no incoming or outgoing links', () => {
    let neighbourhood: Neighbourhood

    beforeEach(async () => {
      const readmodel = rm.instantiate()
      readmodel.commands.create(centreCard)
      neighbourhood = pipe(
        centreCard,
        calculateNeighbourhood(readmodel.queries),
      )
    })

    it('returns only one node', () => {
      expect(neighbourhood.nodes).toStrictEqual([centreCard])
    })

    it('returns no edges', () => {
      expect(neighbourhood.edges).toStrictEqual([])
    })
  })

  describe('when the centre card links to another card', () => {
    const otherCard = arbitraryCard()
    let neighbourhood: Neighbourhood

    beforeEach(async () => {
      centreCard.body = `[[${otherCard.title}]]`
      const readmodel = rm.instantiate()
      readmodel.commands.create(centreCard)
      readmodel.commands.create(otherCard)
      neighbourhood = pipe(
        centreCard,
        calculateNeighbourhood(readmodel.queries),
      )
    })

    it('there are two nodes', () => {
      expect(neighbourhood.nodes).toHaveLength(2)
    })

    it('the nodes include the other card', () => {
      expect(neighbourhood.nodes[1].id).toStrictEqual(otherCard.id)
    })

    it('there is one edge', () => {
      expect(neighbourhood.edges).toHaveLength(1)
    })

    it('there is an edge from the centre card to the other card', () => {
      expect(neighbourhood.edges[0].source).toStrictEqual(centreCard.id)
      expect(neighbourhood.edges[0].target).toStrictEqual(otherCard.id)
    })
  })

  describe('when the centre card and another card link to each other', () => {
    const otherCard = arbitraryCard()
    let neighbourhood: Neighbourhood

    beforeEach(async () => {
      centreCard.body = `[[${otherCard.title}]]`
      otherCard.body = `[[${centreCard.title}]]`
      const readmodel = rm.instantiate()
      readmodel.commands.create(centreCard)
      readmodel.commands.create(otherCard)
      neighbourhood = pipe(
        centreCard,
        calculateNeighbourhood(readmodel.queries),
      )
    })

    it('there are two nodes', () => {
      expect(neighbourhood.nodes).toHaveLength(2)
    })

    it('the nodes include the other card', () => {
      expect(neighbourhood.nodes[1].id).toStrictEqual(otherCard.id)
    })

    it('there are two edges', () => {
      expect(neighbourhood.edges).toHaveLength(2)
    })

    it('there is an edge from the centre card to the other card', () => {
      expect(neighbourhood.edges[0].source).toStrictEqual(centreCard.id)
      expect(neighbourhood.edges[0].target).toStrictEqual(otherCard.id)
    })

    it('there is an edge from the other card to the centre card', () => {
      expect(neighbourhood.edges[1].source).toStrictEqual(otherCard.id)
      expect(neighbourhood.edges[1].target).toStrictEqual(centreCard.id)
    })
  })

  describe('when three cards link to each other', () => {
    const otherCard1 = arbitraryCard()
    const otherCard2 = arbitraryCard()
    let neighbourhood: Neighbourhood

    beforeEach(async () => {
      centreCard.body = `[[${otherCard1.title}]] [[${otherCard2.title}]]`
      otherCard1.body = `[[${otherCard2.title}]]`
      const readmodel = rm.instantiate()
      readmodel.commands.create(centreCard)
      readmodel.commands.create(otherCard1)
      readmodel.commands.create(otherCard2)
      neighbourhood = pipe(
        centreCard,
        calculateNeighbourhood(readmodel.queries),
      )
    })

    it('there are three nodes', () => {
      expect(neighbourhood.nodes).toHaveLength(3)
    })

    it('the nodes include the other cards', () => {
      expect(neighbourhood.nodes[1].id).toStrictEqual(otherCard1.id)
      expect(neighbourhood.nodes[2].id).toStrictEqual(otherCard2.id)
    })

    it('there are three edges', () => {
      expect(neighbourhood.edges).toHaveLength(3)
    })

    it('there is an edge from the centre card to the first other card', () => {
      expect(neighbourhood.edges[0].source).toStrictEqual(centreCard.id)
      expect(neighbourhood.edges[0].target).toStrictEqual(otherCard1.id)
    })

    it('there is an edge from the centre card to the second other card', () => {
      expect(neighbourhood.edges[1].source).toStrictEqual(centreCard.id)
      expect(neighbourhood.edges[1].target).toStrictEqual(otherCard2.id)
    })

    it('there is an edge between the other cards', () => {
      expect(neighbourhood.edges[2].source).toStrictEqual(otherCard1.id)
      expect(neighbourhood.edges[2].target).toStrictEqual(otherCard2.id)
    })
  })
})
