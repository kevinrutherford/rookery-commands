import { Server } from 'http'
import { createTerminus } from '@godaddy/terminus'
import { Logger } from './logger'

export const startServer = (logger: Logger) => (server: Server): void => {
  createTerminus(server, {
    onShutdown: async () => { logger.info('Shutting server down') },
    onSignal: async () => { logger.info('Signal received') },
    signals: ['SIGINT', 'SIGTERM'],
  })
  server.listen(8081)
}

