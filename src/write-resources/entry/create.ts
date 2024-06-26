import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { CommandHandler } from '../../http/command'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  id: NonEmptyString,
  doi: NonEmptyString,
  collectionId: NonEmptyString,
})

export const create: CommandHandler = (eventstore) => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.map((cmd) => ({
    type: 'doi-entered',
    data: {
      id: cmd.id,
      workId: cmd.doi,
      collectionId: cmd.collectionId,
    },
  })),
  TE.chain((event) => eventstore.createStream(`entry.${event.data.id}`)(event)),
  TE.map(() => ({})),
)

