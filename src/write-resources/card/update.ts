import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { Command } from '../command'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  cardid: t.string,
  title: NonEmptyString,
  content: NonEmptyString,
})

type Update = () => Command

export const updateCard: Update = () => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.map(() => ({})),
)

