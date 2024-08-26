import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { createComment, recordCommentCreated } from './record-comment-created'
import { CommandHandler } from '../../http/command'
import { Eventstore } from '../eventstore'
import { validateInput } from '../validate-input'

const paramsCodec = t.intersection([
  t.type({
    '@context': t.array(t.literal('https://www.w3.org/ns/activitystreams')),
  }),
  createComment,
])

type Activity = t.TypeOf<typeof paramsCodec>

const dispatch = (eventstore: Eventstore) => (activity: Activity) => {
  switch (activity.type) {
    case 'Create':
      return recordCommentCreated(eventstore)(activity)
    default:
      return TE.left([{
        code: 'bad-input' as const,
        title: `Unknown activity type "${activity.type}"`,
      }])
  }
}

export const create: CommandHandler = (eventstore) => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.chain(dispatch(eventstore)),
  TE.map(() => ({})),
)

