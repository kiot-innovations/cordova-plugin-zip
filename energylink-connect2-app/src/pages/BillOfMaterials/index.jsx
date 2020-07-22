import ProgressiveImage from 'components/ProgressiveImage'
import { prop, pathOr } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { either } from 'shared/utils'
import { createExternalLinkHandler } from 'shared/routing'
import paths from '../../routes/paths'
import { useI18n } from '../../shared/i18n'
import './BillOfMaterials.scss'

function drawTable(t, inventory) {
  return inventory.map(item => {
    return (
      <tr key={item.item}>
        <td className="pl-10 pt-10 pb-10 pr-10 has-text-white">
          {t(item.item)}
        </td>
        <td className="pt-10 has-text-white">{item.value}</td>
      </tr>
    )
  })
}

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

  const data = useSelector(({ user, inventory }) => ({
    phone: user.data.phoneNumber,
    name: user.data.name,
    bom: inventory.bom
  }))

  const { address1, latitude, longitude } = useSelector(
    pathOr({}, ['site', 'site'])
  )

  const googleMapsUrl = useMap(latitude, longitude)
  const imageURL = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=19&size=320x320&key=${process.env.REACT_APP_MAPS_API_KEY}&maptype=hybrid&markers=scale:1|blue|${latitude},${longitude}&scale=1`

  return (
    <main className="full-height pl-10 pr-10 home">
      <div
        className="pl-10 pr-10 mb-20"
        onClick={createExternalLinkHandler(googleMapsUrl)}
      >
        <ProgressiveImage src={imageURL} />
      </div>
      <span className="is-uppercase is-block is-full-width has-text-centered is-bold mb-30 ">
        {t('CUSTOMER_INFORMATION')}
      </span>
      <section className="mb-40">
        <div className="is-flex is-vertical">
          <div className="is-flex is-vertical tile pl-15">
            <div className="tile is-flex is-vertical">
              <span className="is-uppercase is-size-7 ">{`${t('NAME')}:`}</span>
              <span className="has-text-white mb-10 is-capitalized">
                {data.name}
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
            <span className="has-text-white mb-10">PG&E</span>
          </div>
        </div>
      </section>
      <section className="pb-50">
        {data.bom ? (
          <div>
            <span className="is-block is-full-width has-text-centered is-bold mb-5 has-text-weight-bold">
              {t('INVENTORY')}
            </span>
            <Link
              to={paths.PROTECTED.INVENTORY_COUNT.path}
              className="is-block is-full-width has-text-centered is-bold mb-30 has-text-weight-bold is-uppercase is-size-7"
            >
              {t('EDIT')}
            </Link>
            <table className="bill-of-materials auto mb-50">
              <thead>
                <tr>
                  <th className="is-uppercase pl-10 has-text-white is-size-7">
                    {t('ITEM')}
                  </th>

                  <th className="is-uppercase pl-10 has-text-white is-size-7">
                    {t('QUANTITY')}
                  </th>
                </tr>
              </thead>
              <tbody>{drawTable(t, data.bom)}</tbody>
            </table>
          </div>
        ) : (
          <Link
            to={paths.PROTECTED.INVENTORY_COUNT.path}
            className="is-block is-full-width has-text-centered is-bold mb-30 has-text-weight-bold is-uppercase is-size-7"
          >
            {t('ADD_INVENTORY')}
          </Link>
        )}
      </section>
    </main>
  )
}

export default BillOfMaterials
