import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import * as tt from 'io-ts-types/NonEmptyString'
import { CommandHandler } from '../../http/command'
import { Eventstore } from '../eventstore'
import { validateInput } from '../validate-input'

const theme = t.union([
  t.literal('slate'),
  t.literal('gray'),
  t.literal('zinc'),
  t.literal('neutral'),
  t.literal('stone'),
  t.literal('red'),
  t.literal('orange'),
  t.literal('amber'),
  t.literal('yellow'),
  t.literal('lime'),
  t.literal('green'),
  t.literal('emerald'),
  t.literal('teal'),
  t.literal('cyan'),
  t.literal('sky'),
  t.literal('blue'),
  t.literal('indigo'),
  t.literal('violet'),
  t.literal('purple'),
  t.literal('fuschia'),
  t.literal('pink'),
  t.literal('rose'),
])

const paramsCodec = t.type({
  id: tt.NonEmptyString,
  name: tt.NonEmptyString,
  affiliation: tt.NonEmptyString,
  overview: t.array(tt.NonEmptyString),
  theme,
})

type Params = t.TypeOf<typeof paramsCodec>

const send = (eventstore: Eventstore) => (cmd: Params) => {
  const event = {
    type: 'community-created',
    data: {
      ...cmd,
      actorId: 'you',
    },
  }
  return eventstore.createStream('community')(event)
}

export const create: CommandHandler = (eventstore) => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.chain(send(eventstore)),
  TE.map(() => ({})),
)

