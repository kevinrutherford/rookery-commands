import { createServer } from 'http'
import cors from 'cors'
import express, { json } from 'express'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import helmet from 'helmet'
import { router } from '.'
import { Command } from './command'
import { executeCommand } from './execute-command'
import { logRequest } from './log-request'
import * as L from './logger'
import { Route } from './router'
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

  const server = createServer(express()
    .use(logRequest(logger))
    .use(helmet())
    .use(json())
    .use(cors())
    .use('/', router(routes)),
  )
  server.on('listening', (): void => logger.info('Server running'))
  server.on('close', (): void => logger.info('Server stopping'))
  startServer(logger)(server)
}

