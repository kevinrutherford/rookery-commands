import { create } from './create'
import { destroy } from './destroy'
import { listAll } from './listAll'
import { update } from './update'
import { CardRepository } from '../write-resources'

export const instantiate = (): CardRepository => ({
  updates: {
    create,
    destroy,
    update,
  },
  queries: {
    listAll,
  },
})

