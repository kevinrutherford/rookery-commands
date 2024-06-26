import * as collection from './collection'
import * as comment from './comment'
import * as community from './community'
import * as entry from './entry'
import { Eventstore } from './eventstore'
import * as work from './work'
import { CommandHandler } from '../http/command'
import { Action, Cmd } from '../http/index.open'

const makeEndpoint = (eventstore: Eventstore, action: string) => (path: string, handler: CommandHandler) => ({
  path,
  action: action as Action,
  handler: handler(eventstore),
})

export const instantiate = (eventstore: Eventstore): ReadonlyArray<Cmd> => {
  const create = makeEndpoint(eventstore, 'create')
  const update = makeEndpoint(eventstore, 'update')
  return [
    create('/community', community.create),
    create('/collections', collection.create),
    update('/collections/:id', collection.update),
    create('/entries', entry.create),
    update('/works/:id(10.*)', work.update),
    create('/comments', comment.create),
  ]
}

