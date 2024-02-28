import * as collection from './collection'
import { Command } from './command'

export type Commands = {
  createCollection: Command,
}

export const instantiate = (): Commands => ({
  createCollection: collection.create(),
})
