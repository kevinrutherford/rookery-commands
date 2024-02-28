import { updateCard } from './card/update'
import { Command } from './command'

export type Commands = {
  updateCard: Command,
}

export const instantiate = (): Commands => ({
  updateCard: updateCard(),
})
