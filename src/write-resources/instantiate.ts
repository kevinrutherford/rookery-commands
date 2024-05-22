import * as collection from './collection'
import * as comment from './comment'
import * as community from './community'
import * as entry from './entry'
import * as work from './work'
import { appendStream } from '../eventstore/append-stream'
import { createStream } from '../eventstore/create-stream'
import { Eventstore } from '../eventstore/eventstore'
import { Action, Cmd } from '../http/index.open'

export const instantiate = (): ReadonlyArray<Cmd> => {
  const eventstore: Eventstore = {
    appendStream,
    createStream,
  }

  return [
    { path: '/community', action: 'create' as Action, handler: community.create() },
    { path: '/collections', action: 'create' as Action, handler: collection.create() },
    { path: '/collections/:id', action: 'update' as Action, handler: collection.update(eventstore) },
    { path: '/entries', action: 'create' as Action, handler: entry.create() },
    { path: '/works/:id(10.*)', action: 'update' as Action, handler: work.update(eventstore) },
    { path: '/comments', action: 'create' as Action, handler: comment.create() },
  ]
}

