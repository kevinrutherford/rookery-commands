import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'

export const createCardCommandCodec = t.type({
  title: NonEmptyString,
  content: NonEmptyString,
})

export type CreateCardCommand = t.TypeOf<typeof createCardCommandCodec>

