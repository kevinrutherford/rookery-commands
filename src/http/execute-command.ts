import { Request, Response } from 'express'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { StatusCodes } from 'http-status-codes'
import { Command } from './command'
import { Logger } from './logger'

export type RouteHandler = (req: Request, res: Response) => Promise<void>

type ExecuteCommand = (logger: Logger) => (command: Command) => RouteHandler

export const executeCommand: ExecuteCommand = (logger) => (command) => async (req, res) => {
  await pipe(
    {
      ...req.params,
      ...req.body,
      ...req.query,
    },
    command,
    TE.match(
      (errors) => {
        logger.debug('validation failed', {
          errors: JSON.stringify(errors),
          params: JSON.stringify(req.params),
          body: JSON.stringify(req.body),
          query: JSON.stringify(req.query),
        })
        res.status(StatusCodes.BAD_REQUEST).send({ errors })
      },
      (resource) => res.status(StatusCodes.OK).send(resource),
    ),
  )()
}

