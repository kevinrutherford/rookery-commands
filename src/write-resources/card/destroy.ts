import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { Readmodel } from '../../readmodel'
import { CardRepository } from '../card-repository'
import { Command } from '../command'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  cardid: t.string,
})

type Destroy = (repo: CardRepository, commands: Readmodel['commands']) => Command

export const destroyCard: Destroy = (repo, commands) => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.map((params) => params.cardid),
  TE.chainFirst(repo.updates.destroy),
  TE.map(commands.destroy),
  TE.map(() => ({})),
)

