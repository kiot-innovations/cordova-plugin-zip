import { shareReducer } from '.'
import * as shareActions from '../../actions/share'

describe('Share reducer', () => {
  const reducerTest = reducerTester(shareReducer)
  const initialState = {
    isConverting: false,
    dataUrl: ''
  }
  it('returns the initial state', () => {
    reducerTest(
      initialState,
      {},
      {
        isConverting: false,
        dataUrl: ''
      }
    )
  })

  it('should clear dataUrl & flag true isConverting on CONVERT_BASE64_INIT action fired', () => {
    reducerTest(
      {
        isConverting: false,
        dataUrl: 'some-data-url'
      },
      shareActions.CONVERT_BASE64_INIT(),
      {
        isConverting: true,
        dataUrl: ''
      }
    )
  })

  it('should add dataUrl & flag false isConverting on CONVERT_BASE64_SUCCESS action fired', () => {
    reducerTest(
      {
        isConverting: true,
        dataUrl: ''
      },
      shareActions.CONVERT_BASE64_SUCCESS('new-base64-image'),
      {
        isConverting: false,
        dataUrl: 'new-base64-image'
      }
    )
  })
})
