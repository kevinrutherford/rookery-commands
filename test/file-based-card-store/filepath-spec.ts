import { toPageId } from '../../src/file-based-card-store/filepath'

describe('PageId', () => {

  describe('toPageId', () => {
    it.each([
      ['a-b-c', 'a-b-c'],
      ['a-b-c.page', 'a-b-c'],
      ['a-b-c.page.json', 'a-b-c'],
      ['/pages/a-b-c.page.json', 'a-b-c'],
    ])('converts %s', (filename, expected) => {
      expect(toPageId(filename)).toStrictEqual(expected)
    })
  })

})
