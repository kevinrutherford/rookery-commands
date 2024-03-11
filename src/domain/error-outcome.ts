type Error = {
  source: {
    pointer: string,
  },
  title: string,
  detail?: string,
}

export type ErrorOutcome = ReadonlyArray<Error>

