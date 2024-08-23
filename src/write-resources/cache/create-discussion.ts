import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import * as tt from 'io-ts-types'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { CommandHandler } from '../../http/command'
import { Eventstore } from '../eventstore'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  data: t.type({
    id: NonEmptyString,
    type: t.literal('discussion'),
    attributes: t.type({
      addedAt: tt.DateFromISOString,
      title: NonEmptyString,
      commentsCount: t.number,
    }),
  }),
})

type Params = t.TypeOf<typeof paramsCodec>

const send = (eventstore: Eventstore) => (cmd: Params) => {
  const event = {
    type: 'remote-discussion-fetched',
    data: {
      ...cmd.data,
    },
  }
  return eventstore.createStream(`remote-discussion.${event.data.id}`)(event)
}

export const createDiscussion: CommandHandler = (eventstore) => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.chain(send(eventstore)),
  TE.map(() => ({})),
)

