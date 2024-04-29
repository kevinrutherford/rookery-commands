import { Middleware } from '@koa/router'
import { StatusCodes } from 'http-status-codes'

export default (): Middleware => async (context, next) => {
  context.response.headers = {
    'Cache-Control': 'no-store, must-revalidate',
  }
  context.response.status = StatusCodes.OK
  context.response.body = 'pong'
  await next()
}

