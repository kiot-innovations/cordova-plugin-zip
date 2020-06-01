import { of, throwError } from 'rxjs'
import {
  DOWNLOAD_INIT,
  DOWNLOAD_SUCCESS,
  FIRMWARE_GET_FILE,
  FIRMWARE_GET_FILE_INFO,
  FIRMWARE_METADATA_DOWNLOAD_INIT,
  FIRMWARE_DOWNLOAD_LUA_FILES,
  GET_FILE_ERROR,
  SET_FILE_SIZE,
  SET_FILE_INFO,
  FIRMWARE_DOWNLOAD_INIT
} from 'state/actions/fileDownloader'

import { ERROR_CODES, getLuaZipFileURL } from 'shared/fileSystem'
import * as fileSystem from 'shared/fileSystem'

describe('Epic firmware', () => {
  let epicTest
  let epicFirmwareGetFile
  let epicFirmwareGetFileInfo
  let epicFirmwareDownloadInit
  let epicGetFirmwareMetadataFile
  let epicFirmwareMetadataFileDownloaded
  let epicFirmwareFileDownloaded
  let epicDownloadLuaFilesInit

  describe('epicFirmwareGetFile', () => {
    beforeEach(() => {
      epicFirmwareGetFile = require('./firmware').epicFirmwareGetFile
      epicTest = epicTester(epicFirmwareGetFile)
    })

    it('Dispatches FIRMWARE_GET_FILE_INFO if it receives FIRMWARE_GET_FILE and file is already downloaded', () => {
      fileSystem.getPVSFileSystemName = jest.fn(() =>
        of('firmware/staging-prod-boomer-8888.fs')
      )

      fileSystem.getFileInfo = jest.fn(() => of({ size: 1000 }))

      const inputValues = {
        a: FIRMWARE_GET_FILE()
      }
      const expectedValues = {
        b: FIRMWARE_GET_FILE_INFO()
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })

    it('Dispatches FIRMWARE_GET_FILE_INFO if it receives FIRMWARE_GET_FILE and file is not in FS', () => {
      fileSystem.getPVSFileSystemName = jest.fn(() =>
        of('firmware/staging-prod-boomer-8888.fs')
      )

      fileSystem.getFileInfo = jest.fn(() => throwError(new Error('No file')))

      const inputValues = {
        a: FIRMWARE_GET_FILE()
      }
      const expectedValues = {
        b: FIRMWARE_DOWNLOAD_INIT()
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })
  })

  describe('epicFirmwareGetFileInfo', () => {
    beforeEach(() => {
      epicFirmwareGetFileInfo = require('./firmware').epicFirmwareGetFileInfo
      epicTest = epicTester(epicFirmwareGetFileInfo)
    })

    it('Dispatches SET_FILE_SIZE, SET_FILE_NAME if it receives FIRMWARE_GET_FILE_INFO and metadata file exists', () => {
      fileSystem.parseLuaFile = jest.fn(() => {
        return of({ fileUrl: 'https://test/rootfs.tgz', size: 50000 })
      })

      fileSystem.getFirmwareVersionData = jest.fn(() =>
        of({
          luaFileName: 'staging prod boomer',
          fileURL: 'https://test/staging-prod-boomer/8888/fwup/fwup.lua',
          version: 8888,
          pvsFileSystemName: 'staging-prod-boomer-8888.fs',
          luaDownloadName: 'staging-prod-boomer-8888.lua'
        })
      )

      const inputValues = {
        a: FIRMWARE_GET_FILE_INFO()
      }
      const expectedValues = {
        b: SET_FILE_SIZE(50000),
        c: SET_FILE_INFO({
          displayName: `staging prod boomer - 8888`,
          name: 'staging-prod-boomer-8888.fs'
        })
      }

      const inputMarble = 'a'
      const expectedMarble = '(bc)'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })
  })

  describe('epicFirmwareDownloadInit', () => {
    beforeEach(() => {
      epicFirmwareDownloadInit = require('./firmware').epicFirmwareDownloadInit
      epicTest = epicTester(epicFirmwareDownloadInit)
    })

    it('Dispatches SET_FILE_SIZE, SET_FILE_NAME, DOWNLOAD_INIT if it receives FIRMWARE_DOWNLOAD_INIT and metadata file exists', () => {
      fileSystem.parseLuaFile = jest.fn(() => {
        return of({ fileUrl: 'https://test/rootfs.tgz', size: 50000 })
      })

      fileSystem.getFirmwareVersionData = jest.fn(() =>
        of({
          luaFileName: 'staging prod boomer',
          fileURL: 'https://test/staging-prod-boomer/8888/fwup/fwup.lua',
          version: 8888,
          pvsFileSystemName: 'staging-prod-boomer-8888.fs',
          luaDownloadName: 'staging-prod-boomer-8888.lua'
        })
      )

      const inputValues = {
        a: FIRMWARE_DOWNLOAD_INIT()
      }
      const expectedValues = {
        b: SET_FILE_SIZE(50000),
        c: SET_FILE_INFO({
          displayName: `staging prod boomer - 8888`,
          name: 'staging-prod-boomer-8888.fs'
        }),
        d: DOWNLOAD_INIT({
          fileName: 'staging-prod-boomer-8888.fs',
          fileUrl: 'https://test/rootfs.tgz',
          folder: 'firmware',
          wifiOnly: true
        })
      }

      const inputMarble = 'a'
      const expectedMarble = '(bcd)'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })

    it('Dispatches FIRMWARE_METADATA_DOWNLOAD_INIT if it receives FIRMWARE_DOWNLOAD_INIT and metadata doesnt exists', () => {
      fileSystem.parseLuaFile = jest.fn(() => {
        return throwError(new Error(ERROR_CODES.getVersionInfo))
      })
      fileSystem.getFirmwareVersionData = jest.fn(() =>
        of({
          luaFileName: 'staging prod boomer',
          fileURL: 'https://test/staging-prod-boomer/8888/fwup/fwup.lua',
          version: 8888,
          pvsFileSystemName: 'staging-prod-boomer-8888.fs',
          luaDownloadName: 'staging-prod-boomer-8888.lua'
        })
      )

      const inputValues = {
        a: FIRMWARE_DOWNLOAD_INIT()
      }
      const expectedValues = {
        b: FIRMWARE_METADATA_DOWNLOAD_INIT()
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })
  })

  describe('epicGetFirmwareMetadataFile', () => {
    beforeEach(() => {
      epicGetFirmwareMetadataFile = require('./firmware')
        .epicGetFirmwareMetadataFile
      epicTest = epicTester(epicGetFirmwareMetadataFile)
    })

    it('Dispatches DOWNLOAD_INIT if it receives FIRMWARE_METADATA_DOWNLOAD_INIT', () => {
      fileSystem.getFirmwareVersionData = jest.fn(() =>
        of({
          luaFileName: 'staging prod boomer',
          fileURL: 'https://test/staging-prod-boomer/8888/fwup/fwup.lua',
          version: 8888,
          pvsFileSystemName: 'staging-prod-boomer-8888.fs',
          luaDownloadName: 'staging-prod-boomer-8888.lua'
        })
      )

      const inputValues = {
        a: FIRMWARE_METADATA_DOWNLOAD_INIT()
      }
      const expectedValues = {
        b: SET_FILE_INFO({
          displayName: 'staging prod boomer - 8888',
          name: 'staging-prod-boomer-8888.lua'
        }),
        c: DOWNLOAD_INIT({
          fileName: 'staging-prod-boomer-8888.lua',
          fileUrl: 'https://test/staging-prod-boomer/8888/fwup/fwup.lua',
          folder: 'firmware'
        })
      }

      const inputMarble = 'a'
      const expectedMarble = '(bc)'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })

    it('Dispatches GET_FILE_ERROR if it receives FIRMWARE_METADATA_DOWNLOAD_INIT but no lua file', () => {
      fileSystem.getFirmwareVersionData = jest.fn(() =>
        throwError(new Error(ERROR_CODES.getVersionInfo))
      )

      const inputValues = {
        a: FIRMWARE_METADATA_DOWNLOAD_INIT()
      }
      const expectedValues = {
        b: GET_FILE_ERROR({
          error: 'I ran into an error getting the PVS filename'
        })
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })
  })

  describe('epicFirmwareMetadataFileDownloaded', () => {
    beforeEach(() => {
      epicFirmwareMetadataFileDownloaded = require('./firmware')
        .epicFirmwareMetadataFileDownloaded
      epicTest = epicTester(epicFirmwareMetadataFileDownloaded)
    })

    it('Dispatches FIRMWARE_DOWNLOAD_INIT if it receives DOWNLOAD_SUCCESS', () => {
      fileSystem.getFirmwareVersionData = jest.fn(() => {
        return of({
          luaFileName: 'staging prod boomer',
          fileURL: 'https://test/staging-prod-boomer/8888/fwup/fwup.lua',
          version: 8888,
          pvsFileSystemName: 'staging-prod-boomer-8888.fs',
          luaDownloadName: 'staging-prod-boomer-8888.lua'
        })
      })

      const inputValues = {
        a: DOWNLOAD_SUCCESS({ name: 'staging-prod-boomer-8888.lua' })
      }
      const expectedValues = {
        b: FIRMWARE_DOWNLOAD_INIT()
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })
  })

  describe('epicFirmwareFileDownloaded', () => {
    beforeEach(() => {
      epicFirmwareFileDownloaded = require('./firmware')
        .epicFirmwareFileDownloaded
      epicTest = epicTester(epicFirmwareFileDownloaded)
    })

    it('Dispatches FIRMWARE_DOWNLOAD_LUA_FILES if it receives DOWNLOAD_SUCCESS', () => {
      fileSystem.getFirmwareVersionData = jest.fn(() => {
        return of({
          luaFileName: 'staging prod boomer',
          fileURL: 'https://test/staging-prod-boomer/8888/fwup/fwup.lua',
          version: 8888,
          pvsFileSystemName: 'staging-prod-boomer-8888.fs',
          luaDownloadName: 'staging-prod-boomer-8888.lua'
        })
      })

      const inputValues = {
        a: DOWNLOAD_SUCCESS({ name: 'staging-prod-boomer-8888.fs' })
      }
      const expectedValues = {
        b: FIRMWARE_DOWNLOAD_LUA_FILES(8888)
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })
  })

  describe('epicDownloadLuaFilesInit', () => {
    beforeEach(() => {
      epicDownloadLuaFilesInit = require('./firmware').epicDownloadLuaFilesInit
      epicTest = epicTester(epicDownloadLuaFilesInit)
    })

    it('Dispatches DOWNLOAD_INIT if it receives FIRMWARE_DOWNLOAD_LUA_FILES', () => {
      const inputValues = {
        a: FIRMWARE_DOWNLOAD_LUA_FILES(8888)
      }

      const expectedValues = {
        b: DOWNLOAD_INIT({
          fileUrl: getLuaZipFileURL(8888),
          folder: 'luaFiles',
          unzip: true
        })
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })
  })
})
