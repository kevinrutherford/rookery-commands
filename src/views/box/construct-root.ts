import * as E from 'fp-ts/Either'
import * as WL from '../../domain/WikiLink'
import { Card } from '../../domain/card'
import { View } from '../view'

export const constructRoot: View = () => E.right({
  type: 'Wiki',
  startPage: WL.create('contents' as Card['id'], 'Contents' as Card['title']),
  links: {
    createPage: { href: '/cards', method: 'POST' },
    missingPages: { href: '/cards/missing' },
    orphanPages: { href: '/cards/orphans' },
    recentChanges: { href: '/recentchanges' },
    search: { href: '/search' },
  },
})

