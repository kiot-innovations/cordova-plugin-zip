import * as Sentry from '@sentry/browser'
import { of, throwError } from 'rxjs'

import * as fileSystem from 'shared/fileSystem'
import * as PVSUtils from 'shared/PVSUtils'
import {
  PVS_DECOMPRESS_LUA_FILES_ERROR,
  PVS_DECOMPRESS_LUA_FILES_INIT,
  PVS_DECOMPRESS_LUA_FILES_SUCCESS,
  PVS_FIRMWARE_DOWNLOAD_INIT,
  PVS_FIRMWARE_DOWNLOAD_PROGRESS,
  PVS_FIRMWARE_DOWNLOAD_SUCCESS,
  PVS_FIRMWARE_REPORT_SUCCESS,
  PVS_FIRMWARE_UPDATE_URL,
  PVS_SET_FILE_INFO
} from 'state/actions/fileDownloader'
import { EMPTY_ACTION } from 'state/actions/share'
import { pvsUpdateUrl$ } from 'state/epics/downloader/latestUrls'
import * as fileTransferObservable from 'state/epics/observables/downloader'
import * as unzipObservable from 'state/epics/observables/unzip'

describe('Epic firmware', () => {
  let epicTest
  const url =
    'https://fw-assets-pvs6-dev.dev-edp.sunpower.com/staging-prod-cylon/8110/fwup/fwup.lua'
  describe('updatePVSFirmwareEpic', () => {
    beforeAll(() => {
      pvsUpdateUrl$.next(url)
    })
    it('should dispatch PVS_FIRMWARE_UPDATE_URL with no retry when there is no payload', function() {
      epicTest = epicTester(require('./firmware').updatePVSFirmwareUrl)

      PVSUtils.isConnectedToPVS = jest.fn(() => of(false))
      const inputValues = {
        a: PVS_FIRMWARE_DOWNLOAD_INIT(),
        b: PVS_FIRMWARE_DOWNLOAD_INIT(true)
      }
      const expectedValues = {
        a: PVS_FIRMWARE_UPDATE_URL({
          url,
          shouldRetry: false
        }),
        b: PVS_FIRMWARE_UPDATE_URL({
          url,
          shouldRetry: true
        })
      }
      const inputMarble = 'a-b'
      const expectedMarble = 'a-b'
      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {
        fileDownloader: {
          settings: {
            allowDownloadWithPVS: true
          }
        }
      })
    })
  })
  describe('downloadPVSFirmware', function() {
    it('should dispatch Download progress and success based on answers', function() {
      epicTest = epicTester(require('./firmware').downloadPVSFirmware)
      fileTransferObservable.default = jest.fn(() =>
        of(
          { progress: 10, total: 1000000 },
          { progress: 20, total: 1000000 },
          { total: 1000000 }
        )
      )

      const inputValues = {
        a: PVS_FIRMWARE_UPDATE_URL({
          url,
          shouldRetry: false
        })
      }
      const expectedValues = {
        a: PVS_FIRMWARE_DOWNLOAD_PROGRESS({
          progress: 10,
          size: '1.00'
        }),
        b: PVS_FIRMWARE_DOWNLOAD_PROGRESS({
          progress: 20,
          size: '1.00'
        }),
        c: PVS_FIRMWARE_REPORT_SUCCESS('firmware/staging-prod-cylon-8110.fs')
      }

      const inputMarble = 'a'
      const expectedMarble = '(abc)'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })
    it('should go from reportSuccess to actual sucess', function() {
      epicTest = epicTester(require('./firmware').reportPVSDownloadSuccessEpic)
      fileSystem.verifySHA256 = jest.fn(() =>
        of({
          lastModified: 1597608047172,
          size: 1000000
        })
      )
      const inputValues = {
        a: PVS_FIRMWARE_REPORT_SUCCESS('firmware/staging-prod-cylon-8110.fs')
      }
      const expectedValues = {
        a: PVS_FIRMWARE_DOWNLOAD_SUCCESS({
          lastModified: 1597608047172,
          size: '1.00'
        })
      }

      const inputMarble = 'a'
      const expectedMarble = 'a'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })
  })

  describe('setPVSFirmwareInfoData', function() {
    it('should dispatch PVS_SET_FILE_INFO', function() {
      epicTest = epicTester(require('./firmware').setPVSFirmwareInfoData)

      const inputValues = { a: PVS_FIRMWARE_UPDATE_URL({ url }) }
      const expectedValues = {
        a: PVS_SET_FILE_INFO({
          displayName: 'staging prod cylon - 8110',
          name: 'firmware/staging-prod-cylon-8110.fs'
        })
      }
      const inputMarble = 'a'
      const expectedMarble = '(a)'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })
  })
  describe('decompressLuaFiles', function() {
    it('should dispatch PVS_DECOMPRESS_SUCCESS once it finishes decompressing and must be called with PVS_DECOMPRESS_LUA_FILES', function() {
      epicTest = epicTester(require('./firmware').decompressLuaFiles)
      unzipObservable.default = jest.fn(() => of({ complete: true }))
      const inputValues = { a: PVS_DECOMPRESS_LUA_FILES_INIT() }
      const expectedValues = {
        a: PVS_DECOMPRESS_LUA_FILES_SUCCESS({ complete: true })
      }
      const inputMarble = 'a'
      const expectedMarble = '(a)'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })
    it('should dispatch PVS_DECOMPRESS_ERROR in case of an error', function() {
      const errorData = {
        error: 'Error decompressing the zip file',
        file: 'luaFiles/all.zip'
      }
      epicTest = epicTester(require('./firmware').decompressLuaFiles)
      Sentry.addBreadcrumb = jest.fn(() => {})
      Sentry.captureException = jest.fn(() => {})
      unzipObservable.default = jest.fn(() => throwError(errorData))

      const inputValues = { a: PVS_DECOMPRESS_LUA_FILES_INIT() }
      const expectedValues = {
        a: PVS_DECOMPRESS_LUA_FILES_ERROR(errorData)
      }
      const inputMarble = 'a'
      const expectedMarble = '(a)'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })
  })
  describe('epicDownloadLuaFilesInit', function() {
    it('should download LUA files ith a new UpdateUrl', function() {
      epicTest = epicTester(require('./firmware').downloadLuaFilesInitEpic)
      fileTransferObservable.default = jest.fn(() =>
        of(
          { progress: 10 },
          { progress: 90 },
          { entry: { fullPath: '/luaFiles/all.zip' } }
        )
      )
      const inputValues = { a: PVS_FIRMWARE_UPDATE_URL({ url }) }
      const expectedValues = {
        a: EMPTY_ACTION('Downloading lua files'),
        b: PVS_DECOMPRESS_LUA_FILES_INIT()
      }
      const inputMarble = 'a'
      const expectedMarble = '(aab)'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })
  })
})
