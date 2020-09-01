import { of, throwError } from 'rxjs'
import { ERROR_CODES } from 'shared/fileSystem'
import {
  PVS_FIRMWARE_DOWNLOAD_INIT,
  PVS_FIRMWARE_DOWNLOAD_SUCCESS
} from 'state/actions/fileDownloader'

import {
  FIRMWARE_UPDATE_ERROR_NO_FILE,
  FIRMWARE_UPDATE_INIT
} from '../../actions/firmwareUpdate'
import * as fileSystem from 'shared/fileSystem'
import * as rxjs from 'rxjs'
import {
  PVS_CONNECTION_CLOSE_FINISHED,
  PVS_CONNECTION_INIT
} from '../../actions/network'

describe('Epic firmware update', () => {
  let epicTest
  let firmwareUpgradeInit

  describe('firmwareUpgradeInit', () => {
    beforeEach(() => {
      jest.doMock('rxjs', () => ({
        ...rxjs,
        from: () => {
          return rxjs.from(
            throwError(new Error(ERROR_CODES.NO_FILESYSTEM_FILE))
          )
        }
      }))
      firmwareUpgradeInit = require('./firmwareUpdate').firmwareUpgradeInit

      jest.spyOn(global, 'fetch').mockImplementation(() => {
        of('response')
      })

      epicTest = epicTester(firmwareUpgradeInit)
    })

    it('Dispatches FIRMWARE_UPDATE_ERROR_NO_FILE if it receives FIRMWARE_UPDATE_INIT and file is not yet downloaded', () => {
      fileSystem.getPVSFileSystemName = jest.fn(() => {
        return of('firmware/staging-prod-boomer-8888.fs')
      })

      fileSystem.getFileBlob = jest.fn(() => {
        return of('filedata')
      })

      const inputValues = {
        a: FIRMWARE_UPDATE_INIT({ isAdama: false })
      }
      const expectedValues = {
        b: FIRMWARE_UPDATE_ERROR_NO_FILE()
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
    })
  })

  describe('initFirmwareDownload', () => {
    beforeEach(() => {
      jest.doMock('rxjs', () => ({
        ...rxjs,
        from: () => {
          return rxjs.from(
            throwError(new Error(ERROR_CODES.NO_FILESYSTEM_FILE))
          )
        }
      }))
      const initFirmwareDownload = require('./firmwareUpdate')
        .initFirmwareDownload

      jest.spyOn(global, 'fetch').mockImplementation(() => {
        of('response')
      })

      epicTest = epicTester(initFirmwareDownload)
    })

    it('After disconnecting from the PVS it should download the firmware and start connecting to the PVS', () => {
      fileSystem.getPVSFileSystemName = jest.fn(() => {
        return of('firmware/staging-prod-boomer-8888.fs')
      })

      fileSystem.getFileBlob = jest.fn(() => {
        return of('filedata')
      })

      const inputValues = {
        a: PVS_CONNECTION_CLOSE_FINISHED(),
        b: PVS_FIRMWARE_DOWNLOAD_SUCCESS()
      }
      const expectedValues = {
        c: PVS_FIRMWARE_DOWNLOAD_INIT(),
        d: PVS_CONNECTION_INIT({ ssid: 'SunPower85888', password: '18858888' })
      }

      const inputMarble = 'ab'
      const expectedMarble = 'cd'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {
        network: { SSID: 'SunPower85888', password: '18858888' }
      })
    })
  })
})
