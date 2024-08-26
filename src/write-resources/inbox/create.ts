import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { createComment, recordCommentCreated } from './record-comment-created'
import { CommandHandler } from '../../http/command'
import { validateInput } from '../validate-input'

const paramsCodec = t.intersection([
  t.type({
    '@context': t.array(t.literal('https://www.w3.org/ns/activitystreams')),
  }),
  createComment,
])

export const create: CommandHandler = (eventstore) => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.chain(recordCommentCreated(eventstore)),
  TE.map(() => ({})),
)

