import { of } from 'rxjs'
import {
  GRID_PROFILE_GET_FILE,
  GRID_PROFILE_SET_FILE_INFO
} from '../../actions/gridProfileDownloader'

describe('Epic gridProfile', () => {
  let epicTest
  let epicGetGridProfileFromFS
  let getGridProfileFilePath

  beforeEach(() => {
    getGridProfileFilePath = jest.fn(() => 'gridprofile.tar.gz')

    jest.doMock('../../../shared/fileSystem', () => ({
      getGridProfileFilePath,
      getFileInfo: jest.fn(() => {
        return of({ fileUrl: 'https://test/rootfs.tgz', size: 50000 })
      })
    }))

    epicGetGridProfileFromFS = require('./gridProfile').epicGetGridProfileFromFS
    epicTest = epicTester(epicGetGridProfileFromFS)
  })

  it('Emits GRID_PROFILE_SET_FILE_INFO if GRID_PROFILE_GET_FILE', () => {
    const inputValues = {
      a: GRID_PROFILE_GET_FILE()
    }
    const expectedValues = {
      b: GRID_PROFILE_SET_FILE_INFO({
        fileUrl: 'https://test/rootfs.tgz',
        size: 50000
      })
    }

    const inputMarble = 'a'
    const expectedMarble = 'b'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
  })
})
