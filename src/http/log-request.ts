import { NextFunction, Request, Response } from 'express'
import { Logger } from './logger'

type Middleware = (req: Request, res: Response, next: NextFunction) => Promise<void>

export const logRequest = (logger: Logger): Middleware => async (req, res, next) => {
  const start = Date.now()
  logger.info('HTTP request', {
    method: req.method,
    url: req.url,
  })
  try {
    next()
  } catch (e: unknown) {
    logger.error('Caught exception', {
      error: e,
    })
  } finally {
    logger.info('HTTP response', {
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
    })
  }
}

