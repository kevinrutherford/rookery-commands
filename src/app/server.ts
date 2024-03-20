import { createHttpServer } from '../http/create-server'
import { Action } from '../http/index.open'
import * as writeResources from '../write-resources'

export const makeServer = async (): Promise<void> => {
  const commands = writeResources.instantiate()

  const cmds = [
    { path: '/collections', action: 'create' as Action, handler: commands.createCollection },
    { path: '/entries', action: 'create' as Action, handler: commands.createEntry },
    { path: '/comments', action: 'create' as Action, handler: commands.createComment },
  ]

  createHttpServer(cmds)
}

