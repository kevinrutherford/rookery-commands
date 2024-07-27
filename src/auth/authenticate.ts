import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'

export const authenticate = (token: string | undefined): O.Option<string> => pipe(
  token,
  O.fromNullable,
  O.filter((value) => value === process.env.DEVELOPMENT_BEARER_TOKEN),
)

