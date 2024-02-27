import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { ReadmodelData } from './readmodel-data'
import { Card } from '../domain/card'

const selectRandomElement = <A>(list: ReadonlyArray<A>): A => (
  list[Math.floor(Math.random() * list.length)]
)

export const selectRandomCard = (readmodel: ReadmodelData) => (): O.Option<Card> => pipe(
  Array.from(readmodel.byId.values()),
  RA.match(
    () => O.none,
    (cards) => O.some(selectRandomElement(cards)),
  ),
)

