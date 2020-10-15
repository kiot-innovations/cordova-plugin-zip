import { of } from 'rxjs'
import {
  GRID_PROFILE_DOWNLOAD_ERROR,
  GRID_PROFILE_DOWNLOAD_INIT,
  GRID_PROFILE_DOWNLOAD_PROGRESS,
  GRID_PROFILE_DOWNLOAD_SUCCESS,
  GRID_PROFILE_REPORT_SUCCESS
} from 'state/actions/gridProfileDownloader'
import * as fileTransferObservable from 'state/epics/observables/downloader'
import * as fileSystem from 'shared/fileSystem'
import * as utils from 'shared/utils'
import * as cordovaMapping from 'shared/cordovaMapping'
import { gridProfileUpdateUrl$ } from 'state/epics/downloader/latestUrls'

describe('Epic gridProfile', () => {
  beforeAll(() => {
    gridProfileUpdateUrl$.next(
      'https://s3-us-west-2.amazonaws.com/2oduso0/gridprofiles/v2/gridprofiles.tar.gz'
    )
  })
  it('should show the progress of the download, if complete set the file info', () => {
    const epicTest = epicTester(
      require('./gridProfile').initDownloadGridProfileEpic
    )

    fileTransferObservable.default = jest.fn(() =>
      of(
        { progress: 10 },
        { progress: 20 },
        { progress: 90 },
        { entry: { name: 'gridProfile.tar.gz' }, total: 10000 }
      )
    )
    const inputValues = {
      a: GRID_PROFILE_DOWNLOAD_INIT()
    }
    const expectedValues = {
      a: GRID_PROFILE_DOWNLOAD_PROGRESS(10),
      b: GRID_PROFILE_DOWNLOAD_PROGRESS(20),
      c: GRID_PROFILE_DOWNLOAD_PROGRESS(90),
      d: GRID_PROFILE_REPORT_SUCCESS('firmware/gridProfile.tar.gz')
    }

    const inputMarble = 'a'
    const expectedMarble = '(abcd)'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {
      fileDownloader: {
        settings: {
          allowDownloadWithPVS: true
        }
      }
    })
  })
  it('should dispatch GRID_PROFILE_DOWNLOAD_SUCCESS if it could run all of it correctly', function() {
    fileSystem.getFileInfo = jest.fn(() =>
      of({
        lastModified: 1597608047172,
        size: 1000000
      })
    )

    utils.getExpectedMD5 = jest.fn(() => of('fdfasdasfww'))
    cordovaMapping.getMd5FromFile = jest.fn(() => of('fdfasdasfww'))

    const epicTest = epicTester(
      require('./gridProfile').gridProfileReportSuccessEpic
    )
    const inputValues = {
      a: GRID_PROFILE_REPORT_SUCCESS('firmware/gridProfile.tar.gz')
    }
    const expectedValues = {
      a: GRID_PROFILE_DOWNLOAD_SUCCESS({
        lastModified: 1597608047172,
        size: 1000000
      })
    }
    epicTest('a', 'a', inputValues, expectedValues)
  })
  it('should dispatch GRID_PROFILE_DOWNLOAD_SUCCESS md5 wont match if it could run all of it correctly', function() {
    fileSystem.getFileInfo = jest.fn(() =>
      of({
        lastModified: 1597608047172,
        size: 1000000
      })
    )

    utils.getExpectedMD5 = jest.fn(() => of('fdfasdasfww'))
    cordovaMapping.getMd5FromFile = jest.fn(() => of('xxdfsaf'))

    const epicTest = epicTester(
      require('./gridProfile').gridProfileReportSuccessEpic
    )
    const inputValues = {
      a: GRID_PROFILE_REPORT_SUCCESS('firmware/gridProfile.tar.gz')
    }
    const expectedValues = {
      a: GRID_PROFILE_DOWNLOAD_ERROR({
        error: 'MD5_NOT_MATCHING',
        retry: false
      })
    }
    epicTest('a', 'a', inputValues, expectedValues)
  })
})
