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
      entryId: cmd.id,
      doi: cmd.doi,
      collectionId: cmd.collectionId,
      actorId: 'you',
    },
  })),
  TE.chain((event) => eventstore.createStream(`entry.${event.data.entryId}`)(event)),
  TE.map(() => ({})),
)

