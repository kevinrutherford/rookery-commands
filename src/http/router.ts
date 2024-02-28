import { Router } from 'express'
import { executeCommand } from './execute-command'
import { Logger } from './logger'
import ping from './ping'
import { Commands } from '../write-resources'

export const router = (commands: Commands, logger: Logger): Router => {
  const r = Router()

  r.get('/ping', ping())

  r.post('/cards', executeCommand(logger)(commands.createCard))

  r.patch('/cards/:cardid([a-z0-9.-]+)', executeCommand(logger)(commands.updateCard))

  r.delete('/cards/:cardid([a-z0-9.-]+)', executeCommand(logger)(commands.destroyCard))

  return r
}

