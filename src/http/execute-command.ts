import { Request, Response } from 'express'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { StatusCodes } from 'http-status-codes'
import { errorToStatus } from './error-to-status'
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
      (error) => {
        if (error.category === 'internal-error')
          logger.error(error.message, error.evidence)
        else
          logger.debug(error.message, error.evidence)
        res.status(errorToStatus(error)).send()
      },
      (resource) => res.status(StatusCodes.OK).send(resource),
    ),
  )()
}

