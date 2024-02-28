import { createHttpServer } from '../http/create-server'
import * as writeResources from '../write-resources'

export const makeServer = async (): Promise<void> => {
  const commands = writeResources.instantiate()

  createHttpServer(commands)
}

