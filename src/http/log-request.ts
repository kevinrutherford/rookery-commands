import { Middleware } from 'koa'
import { Logger } from './logger'

export const logRequest = (logger: Logger): Middleware => async (context, next) => {
  const start = Date.now()
  logger.info('HTTP request', {
    method: context.request.method,
    url: context.request.url,
  })
  try {
    await next()
  } catch (e: unknown) {
    logger.error('Caught exception', {
      error: e,
    })
  } finally {
    logger.info('HTTP response', {
      status: context.response.status,
      duration: `${Date.now() - start}ms`,
    })
  }
}

