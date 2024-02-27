export type ErrorOutcome = {
  category: 'bad-input' | 'not-found',
  message: string,
  evidence: Record<string, unknown>,
}

