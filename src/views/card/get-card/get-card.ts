import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { constructViewmodel } from './construct-viewmodel'
import { renderAsResource } from './render-as-resource'
import { Queries } from '../../../readmodel'
import { validateInput } from '../../validate-input'
import { View } from '../../view'

const paramsCodec = t.type({
  cardid: t.string,
})

export const getCard = (queries: Queries): View => (input) => pipe(
  input,
  validateInput(paramsCodec),
  E.map((params) => params.cardid),
  E.chain(constructViewmodel(queries)),
  E.map(renderAsResource),
)

