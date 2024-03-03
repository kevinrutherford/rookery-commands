import * as collection from './collection'
import { Command } from './command'
import * as comment from './comment'
import * as entry from './entry'

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
