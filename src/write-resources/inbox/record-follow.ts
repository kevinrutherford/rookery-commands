import * as t from 'io-ts'
import { v4 } from 'uuid'
import { Eventstore } from '../eventstore'

export const follow = t.type({
  type: t.literal('Follow'),
  actor: t.type({
    type: t.literal('Person'),
    id: t.string,
    inbox: t.string,
  }),
  object: t.type({
    type: t.literal('Person'),
    id: t.string,
  }),
})

type FollowActivity = t.TypeOf<typeof follow>

type Recorder = (eventstore: Eventstore)
=> (activity: FollowActivity)
=> ReturnType<ReturnType<typeof eventstore.createStream>>

export const recordFollow: Recorder = (eventstore) => (activity) => {
  const id = v4()
  const event = {
    type: 'inbox:member-followed-member',
    data: {
      id,
      remoteActorId: activity.actor.id,
      remoteActorInboxUrl: activity.actor.id,
      localMemberId: activity.object.id,
    },
  }
  return eventstore.createStream(`inbox:follow.${id}`)(event)
}

