import { JSONType } from '@eventstore/db-client'

export type DomainEvent = {
  type: string,
  data: JSONType,
}

