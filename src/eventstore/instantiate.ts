import { appendStream } from './append-stream'
import { createStream } from './create-stream'
import { Eventstore } from '../write-resources/eventstore'

export const instantiate = (): Eventstore => ({
  appendStream,
  createStream,
})

