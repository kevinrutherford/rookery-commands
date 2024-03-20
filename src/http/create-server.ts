import { createServer } from 'http'
import cors from 'cors'
import express, { json } from 'express'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'
import helmet from 'helmet'
import { router } from '.'
import { executeCommand } from './execute-command'
import { logRequest } from './log-request'
import * as L from './logger'
import { startServer } from './start-server'
import { Commands } from '../write-resources'

export const createHttpServer = (commands: Commands): void => {
  const logger = L.create({
    emit: (s: string) => process.stdout.write(s),
    colour: process.env.NODE_ENV !== 'production',
    level: process.env.LOG_LEVEL ?? 'debug',
  })

  const routes = pipe(
    [
      { path: '/collections', method: 'post', handler: commands.createCollection },
      { path: '/entries', method: 'post', handler: commands.createEntry },
      { path: '/comments', method: 'post', handler: commands.createComment },
    ],
    A.map((cmd) => ({
      ...cmd,
      handler: executeCommand(logger)(cmd.handler),
    })),
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

