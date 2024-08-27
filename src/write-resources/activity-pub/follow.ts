import * as t from 'io-ts'
import { DomainEvent } from '../domain-event'

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

export type FollowActivity = t.TypeOf<typeof follow>

export const toRookeryEvent = (activity: FollowActivity, id: string): DomainEvent => ({
  type: 'inbox:member-followed-member',
  data: {
    id,
    remoteActorId: activity.actor.id,
    remoteActorInboxUrl: activity.actor.inbox,
    localMemberId: activity.object.id,
  },
})

