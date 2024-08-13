import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { v4 } from 'uuid'
import { CommandHandler } from '../../http/command'
import { Eventstore } from '../eventstore'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  '@context': t.array(t.literal('https://www.w3.org/ns/activitystreams')),
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

type Params = t.TypeOf<typeof paramsCodec>

const send = (eventstore: Eventstore) => (cmd: Params) => {
  const id = v4()
  const event = {
    type: 'inbox:comment-created',
    data: {
      id,
      actorId: cmd.actor.id,
      publishedAt: cmd.published,
      entryId: cmd.target.id,
      content: cmd.object.content,
    },
  }
  return eventstore.createStream(`inbox:comment.${id}`)(event)
}

export const create: CommandHandler = (eventstore) => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.chain(send(eventstore)),
  TE.map(() => ({})),
)

