import * as collection from './collection'
import * as comment from './comment'
import * as community from './community'
import * as entry from './entry'
import * as work from './work'
import { Action, Cmd } from '../http/index.open'

export const instantiate = (): ReadonlyArray<Cmd> => [
  { path: '/community', action: 'create' as Action, handler: community.create() },
  { path: '/collections', action: 'create' as Action, handler: collection.create() },
  { path: '/entries', action: 'create' as Action, handler: entry.create() },
  { path: '/works/:id(10.*)', action: 'update' as Action, handler: work.update() },
  { path: '/comments', action: 'create' as Action, handler: comment.create() },
]

