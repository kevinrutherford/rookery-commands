import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { formatValidationError } from 'io-ts-reporters'
import { ErrorOutcome } from '../http/index.open'

export const validateInput = <A>(codec: t.Decoder<unknown, A>) => (
  input: unknown,
): E.Either<ErrorOutcome, A> => pipe(
  input,
  codec.decode,
  E.mapLeft((errors) => pipe(
    errors,
    RA.map((error) => ({
      code: 'bad-input',
      source: { pointer: `/${error.context.map((c) => c.key).filter(Boolean).join('/')}` },
      title: 'Invalid input',
      detail: pipe(
        error,
        formatValidationError,
        O.getOrElseW(() => undefined),
      ),
    })),
  )),
)

