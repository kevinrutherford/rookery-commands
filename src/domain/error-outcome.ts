export type ErrorOutcome = {
  category: 'bad-input' | 'exists' | 'not-found' | 'internal-error',
  message: string,
  evidence: Record<string, unknown>,
}

