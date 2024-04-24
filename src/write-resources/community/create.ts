import { jsonEvent, JSONEventType } from '@eventstore/db-client'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { Command } from '../../http/index.open'
import { createStream } from '../create-stream'
import { validateInput } from '../validate-input'

type CommunityCreatedEvent = {
  id: string,
  name: string,
  affiliation: string,
  overview: ReadonlyArray<string>,
}

const paramsCodec = t.type({
  id: NonEmptyString,
  name: NonEmptyString,
  affiliation: NonEmptyString,
  overview: t.array(NonEmptyString),
})

type Params = t.TypeOf<typeof paramsCodec>

type SomeEvent = JSONEventType<'community-created', CommunityCreatedEvent>

const send = (cmd: Params): TE.TaskEither<unknown, unknown> => {
  const event = jsonEvent<SomeEvent>({
    type: 'community-created',
    data: cmd,
  })
  return createStream(`community.${event.data.id}`, event)
}

type Create = () => Command

export const create: Create = () => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.map(send),
  TE.map(() => ({})),
)

