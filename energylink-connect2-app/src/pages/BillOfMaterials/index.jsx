import React, { useEffect, useState } from 'react'
import ProgressiveImage from 'components/ProgressiveImage'
import HomeownerAccountCreation from 'components/HomeownerAccountCreation'
import { compose, head, isEmpty, map, pathOr, pick, prop } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { either } from 'shared/utils'
import { createExternalLinkHandler } from 'shared/routing'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import './BillOfMaterials.scss'
import { GET_SITE_INIT } from 'state/actions/site'
import { GET_SCANDIT_USERS } from 'state/actions/scandit'
import { COMMISSIONING_START } from 'state/actions/analytics'
import { DOWNLOAD_VERIFY } from '../../state/actions/fileDownloader'

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

  const [showHomeownerCreation, setShowHomeownerCreation] = useState(false)

  const getPvsSerialNumbers = compose(
    map(pick(['deviceSerialNumber', 'assignmentEffectiveTimestamp'])),
    pathOr([], ['site', 'sitePVS'])
  )
  const PVS = useSelector(getPvsSerialNumbers)

  const data = useSelector(({ user, inventory }) => ({
    phone: user.data.phoneNumber,
    bom: inventory.bom
  }))

  const { address1, latitude, longitude, siteName, siteKey } = useSelector(
    pathOr({}, ['site', 'site'])
  )

  useEffect(() => {
    dispatch(GET_SCANDIT_USERS())
    dispatch(COMMISSIONING_START())
    dispatch(DOWNLOAD_VERIFY())
  }, [dispatch])

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
        <Link
          className="button pt-0 pb-0 is-primary"
          to={paths.PROTECTED.PVS_SELECTION_SCREEN.path}
        >
          {t('START_INSTALL')}
        </Link>
      </section>
      {either(
        !isEmpty(PVS),
        <HomeownerAccountCreation
          open={showHomeownerCreation}
          onChange={() => setShowHomeownerCreation(!showHomeownerCreation)}
          pvs={pathOr('ZTXXXXXXXXXXXXXXXXX', ['deviceSerialNumber'], head(PVS))}
        />
      )}
    </main>
  )
}

export default BillOfMaterials
