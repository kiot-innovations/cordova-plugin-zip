import { map } from 'ramda'
import React, { useState } from 'react'
import ReactCardFlip from 'react-card-flip'
import { Link } from 'react-router-dom'

import './SiteCard.scss'

import paths from '../../routes/paths'
import { SITE_STATES } from '../../shared/siteHelpers'
import { either } from '../../shared/utils'

import { useI18n } from 'shared/i18n'

function SiteCard({ site, state, setSite }) {
  const t = useI18n()
  const [flipped, setFlipped] = useState(false)
  const {
    name,
    address,
    financeType = 'Cash',
    contractNo = '2404819',
    pvsCount = 0,
    snList = ['ZT190785000549A0371', 'ZT190785000549A0372'],
    systemSize = '10kW',
    hasStorage = true
  } = site

  return (
    <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
      {/* FRONT */}
      <SiteWrap flipped={flipped} setFlipped={setFlipped}>
        <h2 className="mb-10 has-text-white">
          {name}
          {either(hasStorage, ' - Storage Site')}
        </h2>
        <p className="mb-10">{address}</p>

        <article className="meta is-flex level">
          <small className="is-block">
            {t('FINANCE_TYPE')}: {financeType}
          </small>
          <small>
            {t('CONTRACT')}: {contractNo}
          </small>
        </article>

        <article className="is-flex level is-fullwidth level">
          {renderFrontCardFooter(state, t, hasStorage)}

          <div className="is-flex has-text-white">
            <span>{pvsCount}</span>
            <i className="sp sp-pvs pt-2" />
          </div>
        </article>
      </SiteWrap>
      {/* END FRONT */}

      {/* BACK */}
      <SiteWrap flipped={flipped}>
        <h2
          className="mb-10 has-text-white"
          onClick={() => setFlipped(!flipped)}
        >
          <span className="pt-5">
            <i className="sp sp-chevron-left has-text-primary" />
          </span>
        </h2>
        {renderBackCardBody(setSite, state, t, snList, systemSize)}
      </SiteWrap>
    </ReactCardFlip>
  )
}

const SiteWrap = ({ flipped, setFlipped = () => {}, children }) => (
  <section
    className="box is-relative"
    onClick={() => setFlipped(!flipped)}
    role="button"
  >
    {children}
  </section>
)

const renderPVS = sn => (
  <div key={sn}>
    <i className="sp sp-pvs has-text-white mr-10" />
    {sn}
  </div>
)

const renderFrontCardFooter = (state, t, hasStorage) => {
  switch (state) {
    case SITE_STATES.NEED_SUNVAULT:
      return <span className="has-text-primary">{t('BEGIN_SV_INSTALL')}</span>

    case SITE_STATES.IS_COMMISSIONED:
      return (
        <p>
          <i className="sp sp-sun has-text-white" />
          {either(
            hasStorage,
            <i className="sp sp-battery has-text-white ml-10" />
          )}
        </p>
      )

    case SITE_STATES.NEED_INSTALL:
      return <p>{t('NO_ASSOCIATED_DEVICES')}</p>

    default:
      return null
  }
}
const renderBackCardBody = (setSite, state, t, snList, systemSize) => {
  switch (state) {
    case SITE_STATES.NEED_SUNVAULT:
      return (
        <article className="has-text-centered is-fullwidth">
          <p className="mb-15">{t('NO_SV_DEVICES')}</p>
          <Link to={paths.PROTECTED.RMA_INVENTORY.path}>
            <span onClick={setSite}>{t('BEGIN_SV_INSTALL')}</span>
          </Link>
        </article>
      )
    case SITE_STATES.IS_COMMISSIONED:
      return (
        <>
          <section className="mb-5">{map(renderPVS, snList)}</section>
          <p className="mb-15">
            <i className="sp sp-sun mr-10 has-text-white" />
            {t('SYSTEM_SIZE')}: {systemSize}
          </p>
          <Link to={paths.PROTECTED.BILL_OF_MATERIALS.path}>
            <span
              className="has-text-centered is-fullwidth is-block"
              onClick={setSite}
            >
              {t('SELECT_THIS_SITE')}
            </span>
          </Link>
        </>
      )

    case SITE_STATES.NEED_INSTALL:
      return (
        <article className="has-text-centered is-fullwidth">
          <p className="mb-15">{t('NO_ASSOCIATED_DEVICES')}</p>
          <Link to={paths.PROTECTED.BILL_OF_MATERIALS.path}>
            <span role="button" onClick={setSite}>
              {t('BEGIN_INSTALL')}
            </span>
          </Link>
        </article>
      )

    default:
      return null
  }
}

export default SiteCard
