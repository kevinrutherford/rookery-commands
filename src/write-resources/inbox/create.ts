import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { createComment, recordCommentCreated } from './record-comment-created'
import { recordFollow } from './record-follow'
import { CommandHandler } from '../../http/command'
import * as Follow from '../activity-pub/follow'
import { Eventstore } from '../eventstore'
import { validateInput } from '../validate-input'

const paramsCodec = t.intersection([
  t.type({
    '@context': t.array(t.literal('https://www.w3.org/ns/activitystreams')),
  }),
  t.union([
    createComment,
    Follow.follow,
  ]),
])

type Activity = t.TypeOf<typeof paramsCodec>

const dispatch = (eventstore: Eventstore) => (activity: Activity) => {
  switch (activity.type) {
    case 'Create':
      return recordCommentCreated(eventstore)(activity)
    case 'Follow':
      return recordFollow(eventstore)(activity)
    default:
      return TE.left([{
        code: 'bad-input' as const,
        title: 'Unknown activity type',
        detail: JSON.stringify(activity),
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

