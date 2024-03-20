import * as collection from './collection'
import * as comment from './comment'
import * as entry from './entry'
import { Action, Cmd } from '../http/index.open'

export const instantiate = (): ReadonlyArray<Cmd> => [
  { path: '/collections', action: 'create' as Action, handler: collection.create() },
  { path: '/entries', action: 'create' as Action, handler: entry.create() },
  { path: '/entries/:id', action: 'update' as Action, handler: entry.update() },
  { path: '/comments', action: 'create' as Action, handler: comment.create() },
]

