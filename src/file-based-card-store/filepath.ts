import { CardId } from './card-id'

const databaseRoot = process.env.DATABASE_ROOT ?? '' // TODO

export const fromPageId = (p: string): string => `${databaseRoot}/pages/${p}.page.json`

export const toPageId = (filename: string): CardId => (
  filename.replace(/^\/pages\//, '')
    .replace(/\.json$/, '')
    .replace(/\.page$/, '') as CardId
)

