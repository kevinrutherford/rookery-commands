import { Router } from 'express'
import { executeCommand } from './execute-command'
import { Logger } from './logger'
import ping from './ping'
import { Commands } from '../write-resources'

export const router = (commands: Commands, logger: Logger): Router => {
  const r = Router()

  r.get('/ping', ping())

  r.patch('/cards/:cardid([a-z0-9.-]+)', executeCommand(logger)(commands.updateCard))

  return r
}

