import { createServer } from 'http'
import cors from 'cors'
import express, { json } from 'express'
import helmet from 'helmet'
import { router } from '.'
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
  const server = createServer(express()
    .use(logRequest(logger))
    .use(helmet())
    .use(json())
    .use(cors())
    .use('/', router(commands, logger)),
  )
  server.on('listening', (): void => logger.info('Server running'))
  server.on('close', (): void => logger.info('Server stopping'))
  startServer(logger)(server)
}

