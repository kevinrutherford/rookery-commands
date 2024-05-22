import * as collection from './collection'
import * as comment from './comment'
import * as community from './community'
import * as entry from './entry'
import * as work from './work'
import { appendStream } from '../eventstore/append-stream'
import { createStream } from '../eventstore/create-stream'
import { Eventstore } from '../eventstore/eventstore'
import { Action, Cmd } from '../http/index.open'

const create = (path: string, handler: Cmd['handler']) => ({
  path,
  action: 'create' as Action,
  handler,
})

const update = (path: string, handler: Cmd['handler']) => ({
  path,
  action: 'update' as Action,
  handler,
})

export const instantiate = (): ReadonlyArray<Cmd> => {
  const eventstore: Eventstore = {
    appendStream,
    createStream,
  }

  return [
    create('/community', community.create()),
    create('/collections', collection.create()),
    update('/collections/:id', collection.update(eventstore)),
    create('/entries', entry.create()),
    update('/works/:id(10.*)', work.update(eventstore)),
    create('/comments', comment.create()),
  ]
}

