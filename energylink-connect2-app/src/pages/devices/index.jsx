import Collapsible from 'components/Collapsible'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { capitalizeString } from 'shared/utils'
import { DISCOVER_COMPLETE, DISCOVER_INIT } from 'state/actions/devices'
import './devices.scss'

const microInverterIcon = (
  <span className="sp-inverter mr-20 devices-icon ml-0 mt-0 mb-0" />
)
const meterIcon = <span className="mr-20 sp-meter ml-0 mt-0 mb-0" />
const storageIcon = <span className="mr-20 sp-battery ml-0 mt-0 mb-0" />
const Icon = (num = 0, max = 0, icon = '') => (
  <div className="is-flex">
    <span className={`${icon} mr-10 ml-0 mt-0 mb-0`} />
    <span className="devices-counter mr-10 ml-0 mt-0 mb-0">{`${num}/${max}`}</span>
  </div>
)
const numberItems = num =>
  num !== 0 && (
    <span className="devices-counter mr-10 ml-0 mt-0 mb-0">{num}</span>
  )

function mapStateToProps({ inventory: { bom }, devices }) {
  const { isFetching, found } = devices
  return {
    isFetching,
    inventory: { inverters: bom.STRING_INVERTERS, meter: bom.METERS },
    found: { inverters: found.inverter, meter: found.meter }
  }
}

const Devices = ({ animationState }) => {
  const { inventory, found, isFetching } = useSelector(mapStateToProps)
  const dispatch = useDispatch()
  const t = useI18n()
  useEffect(() => {
    dispatch(DISCOVER_INIT())
    return () => {
      if (animationState === 'exit') dispatch(DISCOVER_COMPLETE())
    }
  }, [dispatch, animationState])
  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered sunpower-devices">
      <span className="is-uppercase has-text-weight-bold mb-20">
        {capitalizeString(t('DEVICES'))}
      </span>
      <button
        className={`is-uppercase is-size-6 mb-40 ${
          isFetching ? 'is-loading' : ''
        }`}
        onClick={() => dispatch(DISCOVER_INIT())}
      >
        {t('RESCAN')}
      </button>
      <div className="pb-15">
        <Collapsible
          title={capitalizeString(t('MICRO-INVERTERS'))}
          icon={microInverterIcon}
          actions={Icon(found.inverters, inventory.inverters, 'sp-gear')}
        />
      </div>
      <div className="pb-15">
        <Collapsible
          title={capitalizeString(t('METERS'))}
          actions={Icon(found.meter, inventory.meter, '')}
          icon={meterIcon}
        />
      </div>
      <div className="pb-15">
        <Collapsible
          title={capitalizeString(t('STORAGE'))}
          actions={numberItems(10)}
          icon={storageIcon}
        />
      </div>
      <Link
        className="button is-outlined is-primary is-uppercase is-paddingless ml-75 mr-75"
        to={paths.PROTECTED.INVENTORY_COUNT.path}
      >
        {t('ADD-DEVICES')}
      </Link>
    </div>
  )
}

export default Devices
