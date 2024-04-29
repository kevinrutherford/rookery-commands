import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { Command } from '../../http/index.open'
import { createStream } from '../create-stream'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  id: NonEmptyString,
  name: NonEmptyString,
  affiliation: NonEmptyString,
  overview: t.array(NonEmptyString),
})

type Params = t.TypeOf<typeof paramsCodec>

const send = (cmd: Params) => {
  const event = {
    type: 'community-created',
    data: cmd,
  }
  return createStream('community')(event)
}

type Create = () => Command

export const create: Create = () => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.chain(send),
  TE.map(() => ({})),
)

