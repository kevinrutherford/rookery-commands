import { Middleware } from '@koa/router'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
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
  await pipe(
    context.request.body,
    command,
    TE.match(
      (errors) => {
        logger.debug('Command failed', {
          errors: JSON.stringify(errors),
          params: JSON.stringify(context.params),
          body: JSON.stringify(context.request.body),
        })
        context.response.status = errorToStatus(errors)
        context.response.type = 'json'
        context.response.body = { errors }
      },
      (resource) => {
        context.response.status = StatusCodes.OK
        context.response.type = 'json'
        context.response.body = resource
      },
    ),
  )()
}

