import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types/NonEmptyString'
import { appendStream } from '../../eventstore/append-stream'
import { Command } from '../../http/index.open'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  data: t.type({
    type: t.literal('work'),
    id: NonEmptyString,
    attributes: t.union([
      t.type({
        crossrefStatus: t.literal('not-determined'),
        reason: t.union([t.literal('response-unavailable'), t.literal('response-invalid')]),
      }),
      t.type({ crossrefStatus: t.literal('not-found') }),
      t.type({
        crossrefStatus: t.literal('found'),
        title: NonEmptyString,
        abstract: NonEmptyString,
        authors: t.array(NonEmptyString),
      }),
    ]),
  }),
})

type Params = t.TypeOf<typeof paramsCodec>

const send = (cmd: Params) => appendStream(`work.${cmd.data.id}`)({
  type: 'work-updated',
  data: {
    workId: cmd.data.id,
    attributes: cmd.data.attributes,
  },
})

type Update = () => Command

export const update: Update = () => (input) => pipe(
  input,
  validateInput(paramsCodec),
  TE.fromEither,
  TE.chain(send),
  TE.map(() => ({})),
)

