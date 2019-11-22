import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './BillOfMaterials.scss'
import paths from '../../routes/paths'
import RightNow from '../../components/RightNow'
import { useI18n } from '../../shared/i18n'

const BillOfMaterials = () => {
  const data = useSelector(({ user }) => ({
    address: user.data.AddressName,
    phone: user.data.phoneNumber,
    name: `${user.data.firstName} ${user.data.lastName}`,
    bof: [
      { num: 56629, description: 'PVS', qty: 1 },
      {
        num: 56628,
        description: 'This will be a super long text to see how it behaves',
        qty: 1
      },
      { num: 56619, description: 'PVS', qty: 1 },
      { num: 56620, description: 'PVS', qty: 1 },
      { num: 56621, description: 'PVS', qty: 1 },
      { num: 56622, description: 'PVS', qty: 1 },
      { num: 56623, description: 'PVS', qty: 1 },
      { num: 56624, description: 'PVS', qty: 1 },
      { num: 56625, description: 'PVS', qty: 1 },
      { num: 56626, description: 'PVS', qty: 1 },
      { num: 56627, description: 'PVS', qty: 1 }
    ]
  }))
  const t = useI18n()
  return (
    <main className="fill-parent pl-10 pr-10 home">
      <div className="pl-20 pr-20 mb-20">
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=20.6881818,-103.4218501&zoom=21&size=800x800&key=${process.env.REACT_APP_MAPS_API_KEY}&maptype=satellite`}
          title=""
          alt=""
          className="is-fullwidth"
        />
      </div>
      <span className="is-uppercase is-block is-full-width has-text-centered is-bold mb-30 ">
        {t('CUSTOMER_INFORMATION')}
      </span>
      <section className="is-flex mb-40">
        <div className="is-flex is-vertical tile pl-40">
          <div className="tile is-flex is-vertical">
            <span className="is-uppercase is-size-7 ">{`${t('NAME')}:`}</span>
            <span className="has-text-white mb-10 is-capitalized">
              {data.name}
            </span>
          </div>
          <div className="tile is-flex is-vertical">
            <span className="is-uppercase is-size-7">{`${t('ADDRESS')}:`}</span>
            <span className="has-text-white mb-10">{data.address}</span>
          </div>
        </div>
        <div className="is-flex is-vertical tile is-center pr-40">
          <div className="tile is-flex is-vertical">
            <span className=" is-uppercase is-size-7">{`${t('PHONE')}:`}</span>
            <span className="has-text-white mb-10">{data.phone}</span>
          </div>
          <div className="tile is-flex is-vertical">
            <span className=" is-uppercase is-size-7">{`${t('HIDDEN')}:`}</span>
            <span className="has-text-white mb-10">PG&E</span>
          </div>
        </div>
      </section>
      <section className="mb-50">
        <span className="is-block is-full-width has-text-centered is-bold mb-30 has-text-weight-bold">
          {t('INVENTORY')}
        </span>
        {data.bof.length !== 0 ? (
          <table className="bill-of-materials auto mb-50">
            <thead>
              <tr>
                <th className="is-uppercase pl-10 has-text-white is-size-7">
                  item
                </th>

                <th className="is-uppercase pl-10 has-text-white is-size-7">
                  qty
                </th>
              </tr>
            </thead>
            <tbody>
              {data.bof.map(({ num, description, qty }) => (
                <tr key={num}>
                  <td className="pl-20 pt-10 pb-10 pr-10 has-text-white">
                    {num}
                  </td>
                  <td className=" pt-10 has-text-centered has-text-white">
                    {qty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Link
            to={paths.PROTECTED.BILL_OF_MATERIALS.path}
            className="is-block is-full-width has-text-centered is-bold mb-30 has-text-weight-bold"
          >
            Add Inventory
          </Link>
        )}
      </section>
      <section className="is-flex file level space-around section pt-0 mb-20">
        <RightNow />
      </section>
      <section className="is-flex file level space-around section pt-0 mb-20">
        <span className="is-uppercase has-text-white block">
          noticed something wrong?
        </span>
        <Link to={paths.PROTECTED.ROOT.path} className="is-bold">
          SEND A REPORT
        </Link>
      </section>
    </main>
  )
}

export default BillOfMaterials
