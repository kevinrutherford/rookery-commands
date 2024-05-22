import { appendStream } from '../eventstore/append-stream'
import { createStream } from '../eventstore/create-stream'
import { Eventstore } from '../eventstore/eventstore'
import { createHttpServer } from '../http/create-server'
import * as writeResources from '../write-resources'

export const makeServer = async (): Promise<void> => {
  const eventstore: Eventstore = {
    appendStream,
    createStream,
  }

  const commands = writeResources.instantiate(eventstore)

  createHttpServer(commands)
}

