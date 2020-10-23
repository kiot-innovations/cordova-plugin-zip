import { miTypes, PERSIST_DATA_PATH } from './utils'

describe("The variables that shouldn't change", () => {
  it('should not change, PERSIST DATA PATH', function() {
    expect(PERSIST_DATA_PATH).toMatchSnapshot()
  })
  it('should not change the MI Types', function() {
    expect(miTypes).toMatchSnapshot()
  })
})
