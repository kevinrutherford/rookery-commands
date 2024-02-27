import { StatusCodes } from 'http-status-codes'
import { ErrorOutcome } from '../domain/error-outcome'

export const errorToStatus = (code: ErrorOutcome): number => {
  switch (code.category) {
    case 'bad-input':
      return StatusCodes.BAD_REQUEST
    case 'exists':
      return StatusCodes.CONFLICT
    case 'not-found':
      return StatusCodes.NOT_FOUND
    default:
      return StatusCodes.INTERNAL_SERVER_ERROR
  }
}

