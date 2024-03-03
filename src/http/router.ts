import { Router } from 'express'
import { executeCommand } from './execute-command'
import { Logger } from './logger'
import ping from './ping'
import { Commands } from '../write-resources'

export const router = (commands: Commands, logger: Logger): Router => {
  const r = Router()

  r.get('/ping', ping())

  r.post('/collections', executeCommand(logger)(commands.createCollection))
  r.post('/entries', executeCommand(logger)(commands.createEntry))
  r.post('/comments', executeCommand(logger)(commands.createComment))

  return r
}

