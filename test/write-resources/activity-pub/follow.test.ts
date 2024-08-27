import * as Follow from '../../../src/write-resources/activity-pub/follow'
import { arbitraryWord } from '../../helpers'

describe('toRookeryEvent', () => {
  const inboxUrl = arbitraryWord()
  const activity = {
    type: 'Follow',
    actor: {
      type: 'Person',
      id: arbitraryWord(),
      inbox: inboxUrl,
    },
    object: {
      type: 'Person',
      id: arbitraryWord(),
    },
  } satisfies Follow.FollowActivity
  const event = Follow.toRookeryEvent(activity, arbitraryWord())

  it('sets the event inbox to the following actor\'s inbox', () => {
    expect(event.data).toHaveProperty('remoteActorInboxUrl')
    expect(event.data).toStrictEqual(expect.objectContaining({
      remoteActorInboxUrl: inboxUrl,
    }))
  })
})

