import { Middleware } from '@koa/router'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { StatusCodes } from 'http-status-codes'
import { Command } from './command'
import { ErrorOutcome } from './error-outcome'
import { Logger } from './logger'
import { authenticate } from '../auth/authenticate'

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
  context.response.type = 'json'
  const userId = authenticate(context.request.token)
  if (O.isNone(userId)) {
    context.response.status = StatusCodes.UNAUTHORIZED
    context.response.body = [{
      code: 'forbidden',
      title: 'Not authorised',
    }] satisfies ErrorOutcome
    return
  }
  const result = await command(context.request.body)()
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

