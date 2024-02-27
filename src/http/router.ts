import { Router } from 'express'
import { executeCommand } from './execute-command'
import { executeView } from './execute-view'
import { Logger } from './logger'
import ping from './ping'
import { Views } from '../views'
import { Commands } from '../write-resources'

export const router = (views: Views, commands: Commands, logger: Logger): Router => {
  const r = Router()

  r.get('/ping', ping())

  r.get('/', executeView(logger)(views.root))

  r.get('/cards/missing', executeView(logger)(views.listMissingCards))

  r.get('/cards/orphans', executeView(logger)(views.listOrphanCards))

  r.get('/recentchanges', executeView(logger)(views.buildRecentChanges))

  r.get('/search', executeView(logger)(views.search))

  r.get('/cards/:cardid([a-z0-9.-]+)', executeView(logger)(views.getCard))

  r.get('/cards/:cardid([a-z0-9.-]+)/incoming', executeView(logger)(views.incomingLinks))

  r.get('/cards/:cardid([a-z0-9.-]+)/neighbourhood', executeView(logger)(views.constructNeighbourhood))

  r.post('/cards', executeCommand(logger)(commands.createCard))

  r.patch('/cards/:cardid([a-z0-9.-]+)', executeCommand(logger)(commands.updateCard))

  r.delete('/cards/:cardid([a-z0-9.-]+)', executeCommand(logger)(commands.destroyCard))

  return r
}

