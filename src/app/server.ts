import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as fileBasedCardStore from '../file-based-card-store'
import { createHttpServer } from '../http/create-server'
import * as rm from '../readmodel'
import * as writeResources from '../write-resources'

export const makeServer = async (): Promise<void> => {
  const cardStore = fileBasedCardStore.instantiate()
  const readmodel = rm.instantiate()
  await pipe(
    cardStore.queries.listAll(),
    TE.map(RA.map((card) => readmodel.commands.create(card))),
    TE.getOrElse((error) => { throw new Error(JSON.stringify(error)) }),
  )()
  const commands = writeResources.instantiate(cardStore, readmodel)

  createHttpServer(commands)
}

