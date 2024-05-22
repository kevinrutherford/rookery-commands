import * as eventstore from '../eventstore/instantiate'
import { createHttpServer } from '../http/create-server'
import * as writeResources from '../write-resources'

export const makeServer = async (): Promise<void> => {
  const es = eventstore.instantiate()
  const commands = writeResources.instantiate(es)

  createHttpServer(commands)
}

