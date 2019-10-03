import React from 'react'
import { useDispatch } from 'react-redux'
import { useI18n } from '../../shared/i18n'
import { convertToCanvas } from '../../state/actions/share'
import SocialShareButton from '../SocialShareButton'
import { roundDecimals } from '../../shared/rounding'
import {
  BarrelIcon,
  CoalIcon,
  EnvironmentIcon,
  GasDispenserIcon,
  TrashBagIcon,
  TreeIcon,
  TruckIcon,
  InfoIcon
} from './icons'

import './EnvironmentalSavings.scss'

const shareId = 'env-savings'

function envSavingsItem(icon, unit, desc, value) {
  return (
    <div className="env-savings-item">
      <div className="env-savings-item-icon">{icon}</div>
      <div className="env-savings-item-text">
        <h1 className="is-uppercase is-size-7">
          {Math.round(value).toLocaleString()} {unit}
        </h1>
        <h1 className="is-uppercase is-size-7">{desc}</h1>
      </div>
    </div>
  )
}

function EnvironmentalSavings({
  co2 = { value: 0, units: 'ENV_SAVINGS_POUNDS' },
  driven = 0,
  coal = 0,
  oil = 0,
  gas = 0,
  trees = 0,
  garbage = 0
}) {
  const t = useI18n()
  const dispatch = useDispatch()
  return (
    <div id={shareId} className="env-savings is-flex pt-5 pb-5 pl-5 pr-5">
      <div className="icons-container ignore-in-share">
        <div className="actions" />
        <EnvironmentIcon />
        <div className="actions">
          <SocialShareButton
            beforeShare={() => dispatch(convertToCanvas(shareId))}
          />
          <InfoIcon />
        </div>
      </div>
      <h1 className="is-uppercase is-size-3 env-savings-tons">
        <span className="mr-10">
          {roundDecimals(co2.value).toLocaleString()}
        </span>
        {t(co2.units)}
      </h1>
      <h1 className="is-uppercase env-savings-desc1 is-size-7">
        {t('ENV_SAVINGS_DESC1')}
        <sub className="mr-5">2</sub>
        {t('ENV_SAVINGS_DESC_END')}
      </h1>
      <h1 className="is-uppercase env-savings-desc2 is-size-7">
        {t('ENV_SAVINGS_DESC2')}
      </h1>
      <div className="separator is-dotted is-gray-alt mt-15 mb-15" />

      {envSavingsItem(
        <TruckIcon />,
        t('ENV_SAVINGS_DRIVEUNIT'),
        t('ENV_SAVINGS_DRIVEDESC'),
        driven
      )}

      {envSavingsItem(
        <CoalIcon />,
        t('ENV_SAVINGS_COALUNIT'),
        t('ENV_SAVINGS_COALDESC'),
        coal
      )}

      {envSavingsItem(
        <BarrelIcon />,
        t('ENV_SAVINGS_OILUNIT'),
        t('ENV_SAVINGS_OILDESC'),
        oil
      )}

      {envSavingsItem(
        <GasDispenserIcon />,
        t('ENV_SAVINGS_GASUNIT'),
        t('ENV_SAVINGS_GASDESC'),
        gas
      )}

      {envSavingsItem(
        <TreeIcon />,
        t('ENV_SAVINGS_TREESUNIT'),
        t('ENV_SAVINGS_TREESDESC'),
        trees
      )}

      {envSavingsItem(
        <TrashBagIcon />,
        t('ENV_SAVINGS_TRASHUNIT'),
        t('ENV_SAVINGS_TRASHDESC'),
        garbage
      )}
    </div>
  )
}

export default EnvironmentalSavings
