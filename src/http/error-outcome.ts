type ErrorCode =
  | 'bad-input'
  | 'forbidden'
  | 'conflict'

type ErrorDocument = {
  code: ErrorCode,
  source?: {
    pointer: string,
  },
  title: string,
  detail?: string,
}

export type ErrorOutcome = ReadonlyArray<ErrorDocument>

