import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { createStream } from '../../eventstore/create-stream'
import { Command } from '../../http/index.open'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  id: NonEmptyString,
  entryId: NonEmptyString,
  content: NonEmptyString,
})

type Params = t.TypeOf<typeof paramsCodec>

const send = (cmd: Params) => {
  const event = {
    type: 'comment-created',
    data: cmd,
  }
  return createStream(`comment.${event.data.id}`)(event)
}

type Create = () => Command

export const create: Create = () => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.chain(send),
  TE.map(() => ({})),
)

