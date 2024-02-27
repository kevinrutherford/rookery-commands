import { v4 } from 'uuid'

export type CardId = string & { readonly CardId: unique symbol }

export const generate = (): CardId => v4() as CardId
