import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { CommandHandler } from '../../http/command'
import { Eventstore } from '../eventstore'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  id: NonEmptyString,
  type: t.literal('member'),
  attributes: t.type({
    username: NonEmptyString,
    display_name: NonEmptyString,
    avatar_url: NonEmptyString,
    followingCount: t.number,
  }),
})

type Params = t.TypeOf<typeof paramsCodec>

const send = (eventstore: Eventstore) => (cmd: Params) => {
  const event = {
    type: 'remote-member-fetched',
    data: {
      ...cmd,
    },
  }
  return eventstore.createStream(`remote-member.${event.data.id}`)(event)
}

export const createMember: CommandHandler = (eventstore) => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.chain(send(eventstore)),
  TE.map(() => ({})),
)

