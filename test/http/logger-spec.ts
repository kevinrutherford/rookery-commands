import * as L from '../../src/http/logger'

describe('Logger', () => {
  let output: string
  const catcher = (str: string) => {
    output = str
  }
  let opts: L.Config

  beforeEach(() => {
    output = ''
  })

  describe('in development mode', (): void => {

    beforeEach(() => {
      opts = {
        emit: catcher,
        colour: true,
        level: 'warn',
      }
    })

    it('logs the level', () => {
      L.create(opts).warn('hello')
      expect(output).toContain('[warn]')
    })

    it('does not emit unwanted logs', () => {
      L.create(opts).info('hello')
      expect(output).toBe('')
    })

  })

  describe('in production mode', (): void => {

    beforeEach(() => {
      opts = {
        emit: catcher,
        colour: false,
        level: 'warn',
      }
    })

    it('does not output the level in colour', (): void => {
      L.create(opts).warn('hello')
      expect(output).not.toContain('[warn]')
    })

    it('does not emit unwanted logs', () => {
      L.create(opts).info('hello')
      expect(output).toBe('')
    })

  })

})

