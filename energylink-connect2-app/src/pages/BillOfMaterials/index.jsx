import React, { useEffect, useState } from 'react'
import { compose, isEmpty, isNil, map, pathOr, pick, prop } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import ProgressiveImage from 'components/ProgressiveImage'
import HomeownerAccountCreation from 'components/HomeownerAccountCreation'
import { either } from 'shared/utils'
import paths from 'routes/paths'
import { createExternalLinkHandler } from 'shared/routing'
import { useI18n } from 'shared/i18n'
import {
  GET_SITE_INIT,
  CREATE_HOMEOWNER_ACCOUNT_RESET
} from 'state/actions/site'
import { GET_SCANDIT_USERS } from 'state/actions/scandit'
import { DOWNLOAD_VERIFY } from 'state/actions/fileDownloader'
import { CHECK_PERMISSIONS_INIT } from 'state/actions/network'
import { BEGIN_INSTALL } from 'state/actions/analytics'

import './BillOfMaterials.scss'

const useMap = (latitude, longitude) => {
  const [url, setUrl] = useState('')
  useEffect(() => {
    setUrl(
      `https://maps.google.com/maps?daddr=${latitude},${longitude}&amp;ll=`
    )
  }, [latitude, longitude])
  return url
}

function BillOfMaterials() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const [showHomeownerCreation, setShowHomeownerCreation] = useState(false)

  const getPvsSerialNumbers = compose(
    map(pick(['deviceSerialNumber', 'assignmentEffectiveTimestamp'])),
    pathOr([], ['site', 'sitePVS'])
  )
  const PVS = useSelector(getPvsSerialNumbers)
  const isMenuOpen = useSelector(pathOr(false, ['ui', 'menu', 'show']))
  const { lastVisitedPage, showPrecommissioningChecklist } = useSelector(
    state => state.global
  )

  const data = useSelector(({ user, inventory }) => ({
    phone: user.data.phoneNumber,
    bom: inventory.bom
  }))

  const { address1, latitude, longitude, siteName, siteKey } = useSelector(
    pathOr({}, ['site', 'site'])
  )

  const redirectInstall = () => {
    dispatch(BEGIN_INSTALL({ siteKey }))
    if (isNil(lastVisitedPage)) {
      showPrecommissioningChecklist
        ? history.push(paths.PROTECTED.PRECOMM_CHECKLIST.path)
        : history.push(paths.PROTECTED.PVS_SELECTION_SCREEN.path)
    } else {
      history.push(lastVisitedPage)
    }
  }

  useEffect(() => {
    dispatch(GET_SCANDIT_USERS())
    dispatch(CHECK_PERMISSIONS_INIT())
    dispatch(CREATE_HOMEOWNER_ACCOUNT_RESET())
  }, [dispatch])

  useEffect(() => {
    if (!isMenuOpen) {
      dispatch(DOWNLOAD_VERIFY())
    }
  }, [dispatch, isMenuOpen])

  useEffect(() => {
    dispatch(GET_SITE_INIT(siteKey))
  }, [dispatch, siteKey])

  const googleMapsUrl = useMap(latitude, longitude)
  const imageURL = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=19&size=320x320&key=${process.env.REACT_APP_MAPS_API_KEY}&maptype=hybrid&markers=scale:1|blue|${latitude},${longitude}&scale=1`

  return (
    <main className="full-height pl-10 pr-10 homeb">
      <div
        className="pl-10 pr-10 mb-20"
        onClick={createExternalLinkHandler(googleMapsUrl)}
      >
        <ProgressiveImage src={imageURL} />
      </div>
      <span className="is-uppercase is-block is-full-width has-text-centered is-bold mb-30 ">
        {t('CUSTOMER_INFORMATION')}
      </span>
      <section>
        <div className="is-flex is-vertical">
          <div className="is-flex is-vertical tile pl-15">
            <div className="tile is-flex is-vertical">
              <span className="is-uppercase is-size-7 ">{`${t('NAME')}:`}</span>
              <span className="has-text-white mb-10 is-capitalized">
                {siteName}
              </span>
            </div>
            <div className="tile is-flex is-vertical">
              <span className=" is-uppercase is-size-7">{t('PHONE')}:</span>
              {either(
                prop('phone', data),
                <a className="has-text-white mb-10" href={`tel:${data.phone}`}>
                  {data.phone}
                </a>
              )}
            </div>
          </div>
          <div className="is-flex is-vertical tile is-center pr-40">
            <div className="tile is-flex is-vertical is-hidden">
              <span className=" is-uppercase is-size-7">{t('UTILITY')}:</span>
              <span className="has-text-white mb-10">{t('PGE')}</span>
            </div>
          </div>
        </div>
        <div className="tile pl-15 is-flex is-vertical">
          <span className="is-uppercase is-size-7">{`${t('ADDRESS')}:`}</span>
          <span className="has-text-white mb-10">{address1}</span>
        </div>
        <div className="is-flex is-vertical tile is-center pr-40">
          <div className="tile is-flex is-vertical is-hidden">
            <span className=" is-uppercase is-size-7">{`${t(
              'UTILITY'
            )}:`}</span>
            <span className="has-text-white mb-15">PG&E</span>
          </div>
        </div>
        {either(
          !isEmpty(PVS),
          <div className="tile pt-15 is-flex is-vertical">
            <button
              onClick={() => setShowHomeownerCreation(true)}
              className="button is-secondary is-uppercase is-paddingless is-borderless"
            >
              {t('CREATE_HOMEOWNER_ACCOUNT')}
            </button>
          </div>
        )}
      </section>
      <section className="tile is-flex is-vertical button-container mb-20">
        <button
          className="button pt-0 pb-0 is-primary"
          onClick={redirectInstall}
        >
          {t(lastVisitedPage ? 'CONTINUE_INSTALL' : 'BEGIN_INSTALL')}
        </button>
      </section>
      {either(
        !isEmpty(PVS),
        <HomeownerAccountCreation
          open={showHomeownerCreation}
          onChange={() => setShowHomeownerCreation(!showHomeownerCreation)}
        />
      )}
    </main>
  )
}

export default BillOfMaterials
