import * as collection from './collection'
import * as comment from './comment'
import * as entry from './entry'
import { Command } from '../http/index.open'

export type Commands = {
  createCollection: Command,
  createComment: Command,
  createEntry: Command,
}

export const instantiate = (): Commands => ({
  createCollection: collection.create(),
  createComment: comment.create(),
  createEntry: entry.create(),
})
