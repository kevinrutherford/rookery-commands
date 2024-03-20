import { Router } from 'express'
import { executeCommand, RouteHandler } from './execute-command'
import { Logger } from './logger'
import ping from './ping'
import { Commands } from '../write-resources'

type Route = {
  path: string,
  method: string,
  handler: RouteHandler,
}

export const router = (commands: Commands, logger: Logger): Router => {
  const r = Router()

  r.get('/ping', ping())

  const routes: ReadonlyArray<Route> = [
    { path: '/collections', method: 'post', handler: executeCommand(logger)(commands.createCollection) },
    { path: '/entries', method: 'post', handler: executeCommand(logger)(commands.createEntry) },
    { path: '/comments', method: 'post', handler: executeCommand(logger)(commands.createComment) },
  ]

  routes.forEach((route) => {
    switch (route.method) {
      case 'post':
        r.post(route.path, route.handler)
    }
  })

  return r
}

