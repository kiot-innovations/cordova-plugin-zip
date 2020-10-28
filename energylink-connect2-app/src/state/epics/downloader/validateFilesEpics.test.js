import { of, throwError } from 'rxjs'

import * as utils from 'shared/utils'
import {
  FILES_VERIFY,
  FILES_VERIFY_ESS_COMPLETED,
  FILES_VERIFY_FAILED,
  FILES_VERIFY_GP_COMPLETED,
  FILES_VERIFY_PVS_COMPLETED
} from 'state/actions/fileDownloader'
import * as cordovaMapping from 'shared/cordovaMapping'
import * as fileSystem from 'shared/fileSystem'
import { EMPTY_ACTION } from 'state/actions/share'
import { gridProfileUpdateUrl$, pvsUpdateUrl$ } from './latestUrls'

describe('validateFilesEpics', () => {
  describe('gridProfileValidatedEpic', () => {
    beforeAll(() => {
      gridProfileUpdateUrl$.next('fakeurl')
    })

    it('file exists and md5 matches,  validatation completed with payload true', () => {
      utils.getExpectedMD5 = jest.fn(() => of('fdfasdasfww'))
      cordovaMapping.getMd5FromFile = jest.fn(() => of('fdfasdasfww'))

      const epicTest = epicTester(
        require('./validateFilesEpic').gridProfileValidatedEpic
      )

      const inputValues = {
        a: FILES_VERIFY()
      }
      const expectedValues = {
        b: FILES_VERIFY_GP_COMPLETED(true)
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {})
    })

    it('file exists but md5 did not match,  validatation completed with payload false', () => {
      utils.getExpectedMD5 = jest.fn(() => of('123'))
      cordovaMapping.getMd5FromFile = jest.fn(() => of('321'))

      const epicTest = epicTester(
        require('./validateFilesEpic').gridProfileValidatedEpic
      )

      const inputValues = {
        a: FILES_VERIFY()
      }
      const expectedValues = {
        b: FILES_VERIFY_GP_COMPLETED(false)
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {})
    })
  })

  describe('essValidatedEpic', () => {
    it('file exists and md5 matches,  validatation completed with payload true', () => {
      cordovaMapping.getMd5FromFile = jest.fn(() => of('123'))

      const epicTest = epicTester(
        require('./validateFilesEpic').essValidatedEpic
      )

      const inputValues = {
        a: FILES_VERIFY()
      }
      const expectedValues = {
        b: FILES_VERIFY_ESS_COMPLETED(true)
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {
        ess: {
          md5: '123'
        }
      })
    })

    it('file exists and md5 matches,  validatation completed with payload false', () => {
      cordovaMapping.getMd5FromFile = jest.fn(() => of('123'))

      const epicTest = epicTester(
        require('./validateFilesEpic').essValidatedEpic
      )

      const inputValues = {
        a: FILES_VERIFY()
      }
      const expectedValues = {
        b: FILES_VERIFY_ESS_COMPLETED(false)
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {
        ess: {
          md5: '321'
        }
      })
    })
  })

  describe('pvsValidatedEpic', () => {
    beforeAll(() => {
      pvsUpdateUrl$.next('fakeurl')
    })

    it('file exists and checksum matches,  validatation completed with payload true', () => {
      fileSystem.verifySHA256 = jest.fn(() => of('fdfasdasfww'))

      const epicTest = epicTester(
        require('./validateFilesEpic').pvsValidatedEpic
      )

      const inputValues = {
        a: FILES_VERIFY()
      }
      const expectedValues = {
        b: FILES_VERIFY_PVS_COMPLETED(true)
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {})
    })

    it('file exists and checksum matches,  validatation completed with payload false', () => {
      fileSystem.verifySHA256 = jest.fn(() => throwError())

      const epicTest = epicTester(
        require('./validateFilesEpic').pvsValidatedEpic
      )

      const inputValues = {
        a: FILES_VERIFY()
      }
      const expectedValues = {
        b: FILES_VERIFY_PVS_COMPLETED(false)
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {})
    })
  })

  describe('verificationsCompletedEpic', () => {
    it('validations not completed, we do nothing', () => {
      const epicTest = epicTester(
        require('./validateFilesEpic').verificationsCompletedEpic
      )

      const inputValues = {
        a: FILES_VERIFY_PVS_COMPLETED()
      }
      const expectedValues = {
        d: EMPTY_ACTION()
      }

      const inputMarble = 'a'
      const expectedMarble = 'd'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {
        fileDownloader: {
          verification: {
            gpVerified: null,
            pvsVerified: null,
            essVerified: null
          }
        }
      })
    })

    it('validations completed and at least one failed', () => {
      const epicTest = epicTester(
        require('./validateFilesEpic').verificationsCompletedEpic
      )

      const inputValues = {
        a: FILES_VERIFY_PVS_COMPLETED()
      }
      const expectedValues = {
        d: FILES_VERIFY_FAILED()
      }

      const inputMarble = 'a'
      const expectedMarble = 'd'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {
        fileDownloader: {
          verification: {
            gpVerified: false,
            pvsVerified: true,
            essVerified: true
          }
        }
      })
    })

    it('validations completed and all passed', () => {
      const epicTest = epicTester(
        require('./validateFilesEpic').verificationsCompletedEpic
      )

      const inputValues = {
        a: FILES_VERIFY_PVS_COMPLETED()
      }
      const expectedValues = {
        d: EMPTY_ACTION()
      }

      const inputMarble = 'a'
      const expectedMarble = 'd'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {
        fileDownloader: {
          verification: {
            gpVerified: true,
            pvsVerified: true,
            essVerified: true
          }
        }
      })
    })
  })
})
