import { create } from './card/create'
import { destroyCard } from './card/destroy'
import { updateCard } from './card/update'
import { CardRepository } from './card-repository'
import { Command } from './command'
import { Readmodel } from '../readmodel'

export type Commands = {
  createCard: Command,
  destroyCard: Command,
  updateCard: Command,
}

export const instantiate = (repo: CardRepository, readmodel: Readmodel): Commands => ({
  createCard: create(repo, readmodel.commands),
  destroyCard: destroyCard(repo, readmodel.commands),
  updateCard: updateCard(repo, readmodel.commands),
})
