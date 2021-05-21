import { of } from 'rxjs'
import {
  PVS6_GRID_PROFILE_DOWNLOAD_INIT,
  PVS6_GRID_PROFILE_DOWNLOAD_PROGRESS,
  PVS6_GRID_PROFILE_DOWNLOAD_SUCCESS,
  PVS6_GRID_PROFILE_REPORT_SUCCESS,
  PVS6_GRID_PROFILE_DOWNLOAD_ERROR,
  PVS5_GRID_PROFILE_DOWNLOAD_INIT,
  PVS5_GRID_PROFILE_DOWNLOAD_PROGRESS,
  PVS5_GRID_PROFILE_DOWNLOAD_SUCCESS,
  PVS5_GRID_PROFILE_REPORT_SUCCESS,
  PVS5_GRID_PROFILE_DOWNLOAD_ERROR
} from 'state/actions/gridProfileDownloader'
import * as fileTransferObservable from 'state/epics/observables/downloader'
import * as fileSystem from 'shared/fileSystem'
import * as utils from 'shared/utils'
import * as cordovaMapping from 'shared/cordovaMapping'
import {
  pvs6GridProfileUpdateUrl$,
  pvs5GridProfileUpdateUrl$
} from 'state/epics/downloader/latestUrls'

describe('Epic pvs6GridProfile', () => {
  beforeAll(() => {
    pvs6GridProfileUpdateUrl$.next(
      'https://s3-us-west-2.amazonaws.com/2oduso0/gridprofiles/v2/gridprofiles.tar.gz'
    )
  })
  it('should show the progress of the download, if complete set the file info', () => {
    const epicTest = epicTester(
      require('./gridProfile').initDownloadPvs6GridProfileEpic
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
      a: PVS6_GRID_PROFILE_DOWNLOAD_INIT()
    }
    const expectedValues = {
      a: PVS6_GRID_PROFILE_DOWNLOAD_PROGRESS(10),
      b: PVS6_GRID_PROFILE_DOWNLOAD_PROGRESS(20),
      c: PVS6_GRID_PROFILE_DOWNLOAD_PROGRESS(90),
      d: PVS6_GRID_PROFILE_REPORT_SUCCESS('firmware/gridProfile.tar.gz')
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
      require('./gridProfile').pvs6GridProfileReportSuccessEpic
    )
    const inputValues = {
      a: PVS6_GRID_PROFILE_REPORT_SUCCESS('firmware/gridProfile.tar.gz')
    }
    const expectedValues = {
      a: PVS6_GRID_PROFILE_DOWNLOAD_SUCCESS({
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
      require('./gridProfile').pvs6GridProfileReportSuccessEpic
    )
    const inputValues = {
      a: PVS6_GRID_PROFILE_REPORT_SUCCESS('firmware/gridProfile.tar.gz')
    }
    const expectedValues = {
      a: PVS6_GRID_PROFILE_DOWNLOAD_ERROR({
        error: 'MD5_NOT_MATCHING',
        retry: false
      })
    }
    epicTest('a', 'a', inputValues, expectedValues)
  })
})

describe('Epic pvs5GridProfile', () => {
  beforeAll(() => {
    pvs5GridProfileUpdateUrl$.next(
      'https://s3-us-west-2.amazonaws.com/2oduso0/gridprofiles/v1/gridprofiles.tar.gz'
    )
  })
  it('should show the progress of the download, if complete set the file info', () => {
    const epicTest = epicTester(
      require('./gridProfile').initDownloadPvs5GridProfileEpic
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
      a: PVS5_GRID_PROFILE_DOWNLOAD_INIT()
    }
    const expectedValues = {
      a: PVS5_GRID_PROFILE_DOWNLOAD_PROGRESS(10),
      b: PVS5_GRID_PROFILE_DOWNLOAD_PROGRESS(20),
      c: PVS5_GRID_PROFILE_DOWNLOAD_PROGRESS(90),
      d: PVS5_GRID_PROFILE_REPORT_SUCCESS('firmware/gridProfile.tar.gz')
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
      require('./gridProfile').pvs5GridProfileReportSuccessEpic
    )
    const inputValues = {
      a: PVS5_GRID_PROFILE_REPORT_SUCCESS('firmware/gridProfile.tar.gz')
    }
    const expectedValues = {
      a: PVS5_GRID_PROFILE_DOWNLOAD_SUCCESS({
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
      require('./gridProfile').pvs5GridProfileReportSuccessEpic
    )
    const inputValues = {
      a: PVS5_GRID_PROFILE_REPORT_SUCCESS('firmware/gridProfile.tar.gz')
    }
    const expectedValues = {
      a: PVS5_GRID_PROFILE_DOWNLOAD_ERROR({
        error: 'MD5_NOT_MATCHING',
        retry: false
      })
    }
    epicTest('a', 'a', inputValues, expectedValues)
  })
})
