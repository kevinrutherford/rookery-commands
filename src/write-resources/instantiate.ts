import * as collection from './collection'
import * as comment from './comment'
import * as community from './community'
import * as entry from './entry'
import * as work from './work'
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

export const instantiate = (eventstore: Eventstore): ReadonlyArray<Cmd> => {
  return [
    create('/community', community.create(eventstore)),
    create('/collections', collection.create(eventstore)),
    update('/collections/:id', collection.update(eventstore)),
    create('/entries', entry.create(eventstore)),
    update('/works/:id(10.*)', work.update(eventstore)),
    create('/comments', comment.create(eventstore)),
  ]
}

