import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { NonEmptyString } from 'io-ts-types'
import { ErrorOutcome } from '../../../src/domain/error-outcome'
import { CreateCardCommand } from '../../../src/write-resources/card/create-card-command'
import { validateCreateCommand } from '../../../src/write-resources/card/validate-create-command'
import { CardStoreQueries } from '../../../src/write-resources/card-store-queries'
import { arbitraryCard } from '../../domain/arbitrary-card'
import { arbitraryString } from '../../helpers'
import { shouldNotBeCalled } from '../../should-not-be-called'

describe('validate-create-command', () => {
  describe('when everything is valid', () => {
    const command: CreateCardCommand = {
      title: arbitraryString() as NonEmptyString,
      content: arbitraryString() as NonEmptyString,
    }
    const queries: CardStoreQueries = {
      listAll: () => TE.right([]),
    }
    let result: CreateCardCommand

    beforeEach(async () => {
      result = await pipe(
        command,
        validateCreateCommand(queries),
        TE.getOrElse(shouldNotBeCalled),
      )()
    })

    it('returns a command object', () => {
      expect(result).toStrictEqual(command)
    })
  })

  describe.each([
    ['title', { content: arbitraryString() }],
    ['content', { title: arbitraryString() }],
  ])('when the %s is missing', (_, command) => {
    const queries: CardStoreQueries = {
      listAll: shouldNotBeCalled,
    }
    let result: E.Either<ErrorOutcome, CreateCardCommand>

    beforeEach(async () => {
      result = await validateCreateCommand(queries)(command)()
    })

    it('returns an error', () => {
      expect(E.isLeft(result)).toBe(true)
    })
  })

  describe.each([
    ['title', { title: '', content: arbitraryString() }],
    ['content', { title: arbitraryString(), content: '' }],
  ])('when the %s is empty', (_, command) => {
    const queries: CardStoreQueries = {
      listAll: shouldNotBeCalled,
    }
    let result: E.Either<ErrorOutcome, CreateCardCommand>

    beforeEach(async () => {
      result = await validateCreateCommand(queries)(command)()
    })

    it('returns an error', () => {
      expect(E.isLeft(result)).toBe(true)
    })
  })

  describe('when the title is already in use', () => {
    const title = arbitraryString() as NonEmptyString
    const queries: CardStoreQueries = {
      listAll: () => TE.right([{
        ...arbitraryCard(),
        title,
      }]),
    }
    const command: CreateCardCommand = {
      title,
      content: arbitraryString() as NonEmptyString,
    }
    let result: E.Either<ErrorOutcome, CreateCardCommand>

    beforeEach(async () => {
      result = await validateCreateCommand(queries)(command)()
    })

    it('returns an error', () => {
      expect(E.isLeft(result)).toBe(true)
    })
  })
})

