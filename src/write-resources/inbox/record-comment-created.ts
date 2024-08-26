import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { v4 } from 'uuid'
import { Eventstore } from '../eventstore'

export const createComment = t.type({
  type: t.literal('Create'),
  actor: t.type({
    id: t.string,
  }),
  published: t.string,
  object: t.type({
    type: t.literal('Note'),
    content: NonEmptyString,
  }),
  target: t.type({
    type: t.literal('discussion'),
    id: t.string,
  }),
})

type Params = t.TypeOf<typeof createComment>

type Recorder = (eventstore: Eventstore)
=> (cmd: Params)
=> ReturnType<ReturnType<typeof eventstore.createStream>>

export const recordCommentCreated: Recorder = (eventstore) => (cmd) => {
  const id = v4()
  const event = {
    type: 'inbox:comment-created',
    data: {
      id,
      actorId: cmd.actor.id,
      publishedAt: cmd.published,
      discussionId: cmd.target.id,
      content: cmd.object.content,
    },
  }
  return eventstore.createStream(`inbox:comment.${id}`)(event)
}

