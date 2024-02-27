import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import * as PR from 'io-ts/PathReporter'
import { ErrorOutcome } from '../domain/error-outcome'

export const validateInput = <A>(codec: t.Decoder<unknown, A>) => (
  input: unknown,
): E.Either<ErrorOutcome, A> => pipe(
  input,
  codec.decode,
  E.mapLeft((errors) => ({
    category: 'bad-input',
    message: PR.failure(errors).join('\n'),
    evidence: {
      input: JSON.stringify(input),
    },
  })),
)

