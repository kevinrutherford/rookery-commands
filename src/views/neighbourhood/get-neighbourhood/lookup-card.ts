import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { Card } from '../../../domain/card'
import { Queries } from '../../../readmodel'
import { ErrorOutcome } from '../../error-outcome'
import { validateInput } from '../../validate-input'

const params = t.type({
  cardid: t.string,
})

export const lookupCard = (queries: Queries) => (input: unknown): E.Either<ErrorOutcome, Card> => pipe(
  input,
  validateInput(params),
  E.map((p) => p.cardid),
  E.flatMapOption(queries.lookupCardById, () => ({
    category: 'not-found',
    message: 'card not found',
    evidence: { input },
  }) as ErrorOutcome),
)
