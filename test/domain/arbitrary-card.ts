import { Card } from '../../src/domain/card'
import { arbitraryNumber, arbitraryString } from '../helpers'

export const arbitraryCard = ():Card => ({
  id: arbitraryString(),
  title: arbitraryString(),
  body: arbitraryString(),
  modifiedAt: arbitraryNumber(0, 1000),
})
