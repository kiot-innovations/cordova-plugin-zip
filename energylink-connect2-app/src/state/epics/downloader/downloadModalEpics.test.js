import { of } from 'rxjs'

import * as utils from 'shared/utils'
import { translate } from 'shared/i18n'
import { SHOW_MODAL } from 'state/actions/modal'
import { DOWNLOAD_OS_ERROR } from 'state/actions/ess'
import { DOWNLOAD_VERIFY, FILES_VERIFY } from 'state/actions/fileDownloader'

describe('downloadModalEpics', () => {
  describe('downloadingLatestFirmwareEpic', () => {
    it('all downloads are completed, emit empty action', () => {
      const epicTest = epicTester(
        require('./downloadModalEpics').downloadingLatestFirmwareEpic
      )

      const inputValues = {
        a: DOWNLOAD_VERIFY()
      }
      const expectedValues = {
        b: FILES_VERIFY()
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {
        ess: {
          isDownloading: false
        },
        fileDownloader: {
          progress: {
            downloading: false
          },
          gridProfileInfo: {
            progress: 100
          }
        }
      })
    })

    it('ess is downloading, show alert', () => {
      const t = translate()

      const epicTest = epicTester(
        require('./downloadModalEpics').downloadingLatestFirmwareEpic
      )

      const inputValues = {
        a: DOWNLOAD_VERIFY()
      }
      const expectedValues = {
        b: SHOW_MODAL({
          title: t('ATTENTION'),
          componentPath: './Downloads/DownloadInProgressModal.jsx'
        })
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {
        ess: {
          isDownloading: true
        },
        fileDownloader: {
          progress: {
            downloading: false
          },
          gridProfileInfo: {
            progress: 100
          }
        }
      })
    })

    it('firmware is downloading, show alert', () => {
      const t = translate()

      const epicTest = epicTester(
        require('./downloadModalEpics').downloadingLatestFirmwareEpic
      )

      const inputValues = {
        a: DOWNLOAD_VERIFY()
      }
      const expectedValues = {
        b: SHOW_MODAL({
          title: t('ATTENTION'),
          componentPath: './Downloads/DownloadInProgressModal.jsx'
        })
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {
        ess: {
          isDownloading: false
        },
        fileDownloader: {
          progress: {
            downloading: true
          },
          gridProfileInfo: {
            progress: 100
          }
        }
      })
    })

    it('grid profile is downloading, show alert', () => {
      const t = translate()

      const epicTest = epicTester(
        require('./downloadModalEpics').downloadingLatestFirmwareEpic
      )

      const inputValues = {
        a: DOWNLOAD_VERIFY()
      }
      const expectedValues = {
        b: SHOW_MODAL({
          title: t('ATTENTION'),
          componentPath: './Downloads/DownloadInProgressModal.jsx'
        })
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {
        ess: {
          isDownloading: false
        },
        fileDownloader: {
          progress: {
            downloading: false
          },
          gridProfileInfo: {
            progress: 99
          }
        }
      })
    })
  })

  describe('firmwareDownloadFailedEpic', () => {
    it('If epic failed and there is internet, modal should display', () => {
      utils.hasInternetConnection = jest.fn(() => of(true))

      const t = translate()

      const epicTest = epicTester(
        require('./downloadModalEpics').firmwareDownloadFailedEpic
      )

      const inputValues = {
        a: DOWNLOAD_OS_ERROR()
      }
      const expectedValues = {
        b: SHOW_MODAL({
          title: t('ATTENTION'),
          componentPath: './Downloads/DownloadFailedModal.jsx'
        })
      }

      const inputMarble = 'a'
      const expectedMarble = 'b'

      epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {})
    })
  })
})
