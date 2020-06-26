import { renameKeys } from './utils'

describe('renameKeys function', () => {
  it('should rename object keys using a keys map', () => {
    const originalObject = { name: 'Jon', familyName: 'Doe' }
    const expectedRenamedKeysObject = { firstName: 'Jon', lastName: 'Doe' }
    const keysMap = { name: 'firstName', familyName: 'lastName' }
    const renamedKeysObject = renameKeys(keysMap, originalObject)

    expect(renamedKeysObject).toEqual(expectedRenamedKeysObject)
  })
})
