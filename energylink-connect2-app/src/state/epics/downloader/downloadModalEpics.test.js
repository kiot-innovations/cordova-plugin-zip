import { of } from 'rxjs'

import * as utils from 'shared/utils'
import { translate } from 'shared/i18n'
import { SHOW_MODAL } from 'state/actions/modal'
import { DOWNLOAD_OS_ERROR } from 'state/actions/ess'

describe('downloadModalEpics', () => {
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
