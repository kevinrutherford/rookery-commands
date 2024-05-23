import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { CommandHandler } from '../../http/command'
import { Eventstore } from '../eventstore'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  data: t.type({
    type: t.literal('collection'),
    id: NonEmptyString,
    attributes: t.type({
      isPrivate: t.boolean,
    }),
  }),
})

type Params = t.TypeOf<typeof paramsCodec>

const send = (eventstore: Eventstore) => (cmd: Params) => pipe(
  {
    type: 'collection-updated',
    data: {
      collectionId: cmd.data.id,
      attributes: cmd.data.attributes,
    },
  },
  eventstore.appendStream(`collection.${cmd.data.id}`),
)

export const update: CommandHandler = (eventstore) => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.chain(send(eventstore)),
  TE.map(() => ({})),
)

