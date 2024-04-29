import { createServer } from 'http'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { Command } from './command'
import { executeCommand } from './execute-command'
import { logRequest } from './log-request'
import * as L from './logger'
import { Route, router } from './router'
import { startServer } from './start-server'

export type Action = 'create' | 'update' | 'delete'

const actions: Record<Action, Route['method']> = {
  'create': 'post',
  'update': 'patch',
  'delete': 'delete',
}

export type Cmd = {
  path: string,
  action: Action,
  handler: Command,
}

export const createHttpServer = (commands: ReadonlyArray<Cmd>): void => {
  const logger = L.create({
    emit: (s: string) => process.stdout.write(s),
    colour: process.env.NODE_ENV !== 'production',
    level: process.env.LOG_LEVEL ?? 'debug',
  })

  const routes = pipe(
    commands,
    RA.map((cmd) => ({
      path: cmd.path,
      method: actions[cmd.action],
      handler: executeCommand(logger)(cmd.handler),
    }) satisfies Route),
  )

  const routery = router(routes)

  const app = new Koa()
  app.use(logRequest(logger))
  app.use(bodyParser({ enableTypes: ['json'] }))
  app.use(routery.routes())
  app.use(routery.allowedMethods())
  const server = createServer(app.callback())
  server.on('listening', (): void => logger.info('Server running'))
  server.on('close', (): void => logger.info('Server stopping'))
  startServer(logger)(server)
}

