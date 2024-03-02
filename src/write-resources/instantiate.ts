import * as collection from './collection'
import { Command } from './command'
import * as entry from './entry'

export type Commands = {
  createCollection: Command,
  createEntry: Command,
}

export const instantiate = (): Commands => ({
  createCollection: collection.create(),
  createEntry: entry.create(),
})
