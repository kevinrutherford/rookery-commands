import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { CommandHandler } from '../../http/command'
import { Eventstore } from '../eventstore'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  id: NonEmptyString,
  name: NonEmptyString,
  description: NonEmptyString,
})

type Params = t.TypeOf<typeof paramsCodec>

const send = (eventstore: Eventstore, userId: string) => (cmd: Params) => {
  const event = {
    type: 'collection-created',
    data: {
      ...cmd,
      actorId: userId,
    },
  }
  return eventstore.createStream(`collection.${event.data.id}`)(event)
}

export const create: CommandHandler = (eventstore) => (input, userId) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.chain(send(eventstore, userId)),
  TE.map(() => ({})),
)

