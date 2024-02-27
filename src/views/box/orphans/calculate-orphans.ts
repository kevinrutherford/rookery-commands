import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { findOrphansAmong } from './find-orphans-among'
import { Card } from '../../../domain/card'
import { toReferencedTitles } from '../../to-referenced-titles'

export const calculateOrphans = (allCards: ReadonlyArray<Card>): ReadonlyArray<Card> => pipe(
  allCards,
  RA.chain(toReferencedTitles),
  findOrphansAmong(allCards),
)

