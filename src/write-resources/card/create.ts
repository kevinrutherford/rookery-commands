import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { validateCreateCommand } from './validate-create-command'
import { toWikiLink } from '../../domain/WikiLink'
import { Readmodel } from '../../readmodel'
import { CardRepository } from '../card-repository'
import { Command } from '../command'

type Create = (repo: CardRepository, commands: Readmodel['commands']) => Command

export const create: Create = (repo, commands) => (input) => pipe(
  input,
  validateCreateCommand(repo.queries),
  TE.chain((data) => repo.updates.create(data.title, data.content)),
  TE.map(commands.create),
  TE.map(toWikiLink),
)

