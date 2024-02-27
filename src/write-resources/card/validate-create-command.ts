import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { formatValidationErrors } from 'io-ts-reporters'
import { CreateCardCommand, createCardCommandCodec } from './create-card-command'
import { ErrorOutcome } from '../../domain/error-outcome'
import { CardStoreQueries } from '../card-store-queries'

const titleMustBeUnique = (queries: CardStoreQueries) => (command: CreateCardCommand) => pipe(
  queries.listAll(),
  TE.map(RA.map((card) => card.title)),
  TE.filterOrElse((titles) => !titles.includes(command.title), () => ({
    category: 'bad-input',
    message: 'title already in use',
    evidence: command,
  }) as ErrorOutcome),
  TE.map(() => command),
)

type ValidateCreateCommand = (queries: CardStoreQueries)
=> (input: unknown)
=> TE.TaskEither<ErrorOutcome, CreateCardCommand>

export const validateCreateCommand: ValidateCreateCommand = (queries) => (input) => pipe(
  input,
  createCardCommandCodec.decode,
  E.mapLeft((errors) => ({
    category: 'bad-input' as const,
    message: formatValidationErrors(errors).join('\n'),
    evidence: { input },
  })),
  TE.fromEither,
  TE.chain(titleMustBeUnique(queries)),
)

