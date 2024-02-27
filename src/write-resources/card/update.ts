import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { Readmodel } from '../../readmodel'
import { CardRepository } from '../card-repository'
import { Command } from '../command'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  cardid: t.string,
  title: NonEmptyString,
  content: NonEmptyString,
})

type Update = (repo: CardRepository, commands: Readmodel['commands']) => Command

export const updateCard: Update = (repo, commands) => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.chainFirst((params) => repo.updates.update(params.cardid, params.title, params.content)),
  TE.map((params) => {
    commands.update({
      id: params.cardid,
      title: params.title,
      body: params.content,
      modifiedAt: new Date().getTime() / 1000,
    })
    return ({})
  }),
)

