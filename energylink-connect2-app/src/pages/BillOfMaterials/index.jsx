import { compose, isEmpty, isNil, map, pathOr, pick, prop } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import HomeownerAccountCreation from 'components/HomeownerAccountCreation'
import ProgressiveImage from 'components/ProgressiveImage'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { createExternalLinkHandler } from 'shared/routing'
import { either, isDownloadingFiles } from 'shared/utils'
import { BEGIN_INSTALL } from 'state/actions/analytics'
import { DOWNLOAD_OS_INIT } from 'state/actions/ess'
import { CHECK_PERMISSIONS_INIT } from 'state/actions/network'
import { GET_SCANDIT_USERS } from 'state/actions/scandit'
import {
  GET_SITE_INIT,
  CREATE_HOMEOWNER_ACCOUNT_RESET
} from 'state/actions/site'

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
  const isDownloading = useSelector(isDownloadingFiles)
  const { lastVisitedPage, showPrecommissioningChecklist } = useSelector(
    state => state.global
  )

  const data = useSelector(({ user, inventory }) => ({
    phone: user.data.phoneNumber,
    bom: inventory.bom
  }))

  const {
    address1,
    latitude,
    longitude,
    siteName,
    siteKey,
    contractNumber,
    financeType,
    validStorageSystemSizeKw,
    hasStorage,
    systemSize,
    pvsCount
  } = useSelector(pathOr({}, ['site', 'site']))

  const redirectInstall = () => {
    dispatch(BEGIN_INSTALL({ siteKey }))
    if (isDownloading)
      return history.push(paths.PROTECTED.FIRMWARE_DOWNLOAD.path)
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
    dispatch(DOWNLOAD_OS_INIT())
  }, [dispatch])

  useEffect(() => {
    dispatch(GET_SITE_INIT(siteKey))
  }, [dispatch, siteKey])

  const googleMapsUrl = useMap(latitude, longitude)
  const imageURL = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=19&size=320x320&key=${process.env.REACT_APP_MAPS_API_KEY}&maptype=hybrid&markers=scale:1|blue|${latitude},${longitude}&scale=1`

  return (
    <main className="full-min-height pl-10 pr-10 homeb">
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
        <div className="is-flex is-vertical mt-20">
          <div className="is-flex is-vertical tile pl-15">
            <div className="tile is-flex is-vertical">
              <span className="is-uppercase is-size-7 ">{`${t('NAME')}:`}</span>
              <span className="has-text-white mb-10 is-capitalized">
                {siteName}
              </span>
            </div>

            {either(
              prop('phone', data),
              <div className="tile is-flex is-vertical">
                <span className=" is-uppercase is-size-7">{t('PHONE')}:</span>
                <a className="has-text-white mb-10" href={`tel:${data.phone}`}>
                  {data.phone}
                </a>
              </div>
            )}
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
        <div className="is-flex is-vertical tile pl-15">
          <div className="tile is-flex is-vertical">
            {either(
              contractNumber,
              <div className="tile is-flex is-vertical">
                <span className=" is-uppercase is-size-7">
                  {t('CONTRACT_NO')}:
                </span>
                <p className="has-text-white mb-10">{contractNumber}</p>
              </div>
            )}

            {either(
              financeType,
              <div className="tile is-flex is-vertical">
                <span className=" is-uppercase is-size-7">
                  {t('FINANCE_TYPE')}:
                </span>
                <p className="has-text-white mb-10">{financeType}</p>
              </div>
            )}

            <span className=" is-uppercase is-size-7">
              {t('STORAGE_SYSTEM_SIZE')}:
            </span>
            <p className="has-text-white mb-10">
              {either(hasStorage, `${validStorageSystemSizeKw} kWh`, 'N/A')}
            </p>
          </div>

          <div className="tile is-flex is-vertical">
            <span className=" is-uppercase is-size-7">{t('SYSTEM_SIZE')}:</span>
            <p className="has-text-white mb-10">{systemSize}</p>
          </div>

          {either(
            siteKey,
            <div className="tile is-flex is-vertical">
              <span className=" is-uppercase is-size-7">{t('SITE_KEY')}:</span>
              <p className="has-text-white mb-10">{siteKey}</p>
            </div>
          )}

          {either(
            pvsCount,
            <div className="tile is-flex is-vertical">
              <span className=" is-uppercase is-size-7">{t('PVS_COUNT')}:</span>
              <p className="has-text-white mb-10">{pvsCount}</p>
            </div>
          )}
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
      <section className="tile is-flex is-vertical button-container mb-20 ha">
        <button
          className="button pt-0 pb-0 is-primary"
          onClick={redirectInstall}
        >
          {t(
            either(
              lastVisitedPage,
              'CONTINUE_INSTALL',
              showHomeownerCreation ? 'CONTINUE_INSTALL' : 'BEGIN_INSTALL'
            )
          )}
        </button>
      </section>
      {either(
        !isEmpty(PVS),
        <HomeownerAccountCreation
          open={showHomeownerCreation}
          onChange={() => {
            setShowHomeownerCreation(!showHomeownerCreation)
            dispatch(CREATE_HOMEOWNER_ACCOUNT_RESET())
          }}
        />
      )}
    </main>
  )
}

export default BillOfMaterials
