import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { Neighbourhood } from './neighbourhood'

type NeighbourhoodResource = {
  type: 'Neighbourhood',
  nodes: ReadonlyArray<{
    id: string,
    title: string,
  }>,
  edges: ReadonlyArray<{
    source: string,
    target: string,
  }>,
}

export const renderAsResource = (n: Neighbourhood): NeighbourhoodResource => ({
  type: 'Neighbourhood',
  nodes: pipe(
    n.nodes,
    RA.map((node) => ({
      id: node.id,
      title: node.title,
    })),
  ),
  edges: n.edges,
})
