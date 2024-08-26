import * as t from 'io-ts'
import { v4 } from 'uuid'
import { Eventstore } from '../eventstore'

export const follow = t.type({
  type: t.literal('Follow'),
  actor: t.type({
    type: t.literal('member'),
    id: t.string,
  }),
  object: t.type({
    type: t.literal('member'),
    id: t.string,
  }),
})

type Params = t.TypeOf<typeof follow>

type Recorder = (eventstore: Eventstore)
=> (cmd: Params)
=> ReturnType<ReturnType<typeof eventstore.createStream>>

export const recordFollow: Recorder = (eventstore) => (cmd) => {
  const id = v4()
  const event = {
    type: 'inbox:member-followed-member',
    data: {
      id,
      remoteActorId: cmd.actor.id,
      remoteActorUrl: cmd.actor.id,
      localMemberId: cmd.object.id,
    },
  }
  return eventstore.createStream(`inbox:follow.${id}`)(event)
}

