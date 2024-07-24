import { Middleware } from '@koa/router'
import * as E from 'fp-ts/Either'
import { StatusCodes } from 'http-status-codes'
import { Command } from './command'
import { ErrorOutcome } from './error-outcome'
import { Logger } from './logger'

const errorToStatus = (errors: ErrorOutcome): number => {
  switch (errors[0].code) {
    case 'bad-input':
      return StatusCodes.BAD_REQUEST
    case 'forbidden':
      return StatusCodes.FORBIDDEN
    case 'conflict':
      return StatusCodes.CONFLICT
    default:
      return StatusCodes.INTERNAL_SERVER_ERROR
  }
}

export type RouteHandler = Middleware

type ExecuteCommand = (logger: Logger) => (command: Command) => RouteHandler

export const executeCommand: ExecuteCommand = (logger) => (command) => async (context) => {
  const result = await command(context.request.body)()
  context.response.type = 'json'
  if (E.isRight(result)) {
    context.response.status = StatusCodes.OK
    context.response.body = result.right
  } else {
    logger.debug('Command failed', {
      errors: JSON.stringify(result.left),
      params: JSON.stringify(context.params),
      body: JSON.stringify(context.request.body),
    })
    context.response.status = errorToStatus(result.left)
    context.response.body = { result: result.left }
  }
}

