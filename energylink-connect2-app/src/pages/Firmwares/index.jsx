import {
  complement,
  compose,
  head,
  identity,
  ifElse,
  isNil,
  match,
  prop,
  propOr
} from 'ramda'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import FirmwaresMenu from './MenuComponent'

import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { isDownloadingFiles } from 'shared/utils'

export const getFileName = compose(
  ifElse(complement(isNil), compose(head, match(/([0-9]+)$/)), identity),
  prop('displayName')
)
export const getFileSize = prop('size')

const Separator = () => <div className="mt-20" />

function Firmwares() {
  const t = useI18n()
  const history = useHistory()

  const isDownloading = useSelector(isDownloadingFiles)
  const { lastVisitedPage, showPrecommissioningChecklist } = useSelector(
    propOr({}, 'global')
  )

  const continueButtonClick = () => {
    if (lastVisitedPage === paths.PROTECTED.PVS_SELECTION_SCREEN.path) {
      showPrecommissioningChecklist
        ? history.push(paths.PROTECTED.PRECOMM_CHECKLIST.path)
        : history.push(paths.PROTECTED.PVS_SELECTION_SCREEN.path)
    } else {
      history.push(lastVisitedPage)
    }
  }
  return (
    <FirmwaresMenu
      showDetails={false}
      className="vertical-scroll"
      message={t('FW_DOWNLOAD_WAIT')}
    >
      <Separator />
      <div className="has-text-centered">
        <button
          className="button is-primary is-uppercase"
          disabled={isDownloading}
          onClick={continueButtonClick}
        >
          {t('CONTINUE')}
        </button>
      </div>
      <br />
      <br />
    </FirmwaresMenu>
  )
}

export default Firmwares
