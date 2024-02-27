import { Request, Response } from 'express'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { StatusCodes } from 'http-status-codes'
import { Logger } from './logger'
import { ErrorOutcome, View } from '../views'

const errorToStatus = (code: ErrorOutcome): number => {
  switch (code.category) {
    case 'bad-input':
      return StatusCodes.BAD_REQUEST
    case 'not-found':
      return StatusCodes.NOT_FOUND
    default:
      return StatusCodes.INTERNAL_SERVER_ERROR
  }
}

type ExecuteView = (logger: Logger) => (view: View) => (req: Request, res: Response) => void

export const executeView: ExecuteView = (logger) => (view) => (req, res) => {
  pipe(
    {
      ...req.params,
      ...req.body,
      ...req.query,
    },
    view,
    E.match(
      (error) => {
        logger.debug(error.message, error.evidence)
        res.status(errorToStatus(error)).send()
      },
      (resource) => res.status(StatusCodes.OK).send(resource),
    ),
  )
}

