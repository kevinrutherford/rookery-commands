import { pipe } from 'fp-ts/function'
import { v4 } from 'uuid'
import * as Follow from '../activity-pub/follow'
import { Eventstore } from '../eventstore'

type Recorder = (eventstore: Eventstore)
=> (activity: Follow.FollowActivity)
=> ReturnType<ReturnType<typeof eventstore.createStream>>

export const recordFollow: Recorder = (eventstore) => (activity) => {
  const id = v4()
  return pipe(
    Follow.toRookeryEvent(activity, id),
    eventstore.createStream(`inbox:follow.${id}`),
  )
}

