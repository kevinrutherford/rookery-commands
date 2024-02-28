import { updateCard } from './card/update'
import { CardRepository } from './card-repository'
import { Command } from './command'
import { Readmodel } from '../readmodel'

export type Commands = {
  updateCard: Command,
}

export const instantiate = (repo: CardRepository, readmodel: Readmodel): Commands => ({
  updateCard: updateCard(repo, readmodel.commands),
})
