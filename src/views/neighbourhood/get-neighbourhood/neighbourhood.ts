import { Card } from '../../../domain/card'

export type Edge = {
  source: Card['id'],
  target: Card['id'],
}

export type Neighbourhood = {
  nodes: ReadonlyArray<{
    id: Card['id'],
    title: Card['title'],
  }>,
  edges: ReadonlyArray<Edge>,
}

