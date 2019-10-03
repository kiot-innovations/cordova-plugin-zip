import React from 'react'
import clsx from 'clsx'
import ModalLayout from '../../components/ModalLayout'
import BlockGrid from '../../components/BlockGrid'
import BlockItem from '../../components/BlockItem'
import { useI18n } from '../../shared/i18n'
import {
  LiveChatIcon,
  FaqIcon,
  DocumentsIcon,
  SubmitARequestIcon
} from './Icons'
import { Phone } from '../../components/Icons'
import paths from '../Router/paths'

import './HelpCenter.scss'

function HelpCenter({ history, location, className }) {
  const t = useI18n()
  const classes = clsx('help-center-modal', className)
  return (
    <ModalLayout
      className={classes}
      history={history}
      title={t('HELP_CENTER')}
      from={location && location.state && location.state.from}
      hasBackButton
    >
      <div className="help-center container columns full-height is-flex has-text-centered">
        <div className="column is-hidden-mobile"></div>
        <div className="column">
          <BlockGrid location={location}>
            <BlockItem
              className="full-width-title"
              title={t('LIVE_CHAT')}
              to={paths.HELP_LIVE_CHAT}
              icon={<LiveChatIcon />}
            />
            <BlockItem
              title={t('FAQ')}
              to={paths.HELP_FAQ}
              icon={<FaqIcon />}
            />
            <BlockItem
              className="full-width-title"
              title={t('DOCUMENTS')}
              to={paths.HELP_DOCUMENTS}
              icon={<DocumentsIcon />}
            />
            <BlockItem
              title={t('SUBMIT_A_REQUEST')}
              to={paths.HELP_SUBMIT_A_REQUEST}
              icon={<SubmitARequestIcon />}
            />
          </BlockGrid>
        </div>
        <div className="column">
          <div className="call-us mb-30 hero">
            <span className="mb-10">{t('OR_CALL_US')}:</span>
            <div className="columns is-flex">
              <div>
                <Phone />
              </div>
              <div className="is-size-6 ml-20">
                <div className="mb-5">
                  <a href="tel:18007867693" className="has-text-weight-normal">
                    1-800-sunpower
                  </a>
                </div>
                <div className="has-text-left">
                  <a href="tel:18007867693" className="has-text-weight-normal">
                    1-800-786-7693
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalLayout>
  )
}

export default HelpCenter
