import { Request, Response } from 'express'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { StatusCodes } from 'http-status-codes'
import { Logger } from './logger'
import { Command } from '../write-resources'

type ExecuteCommand = (logger: Logger) => (command: Command) => (req: Request, res: Response) => Promise<void>

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
        logger.debug('validation failed', { errors })
        res.status(StatusCodes.BAD_REQUEST).send({ errors })
      },
      (resource) => res.status(StatusCodes.OK).send(resource),
    ),
  )()
}

