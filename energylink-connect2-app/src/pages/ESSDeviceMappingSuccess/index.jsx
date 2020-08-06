import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useI18n } from 'shared/i18n'
import DeviceMap from 'components/DeviceMap'
import { pathOr, isEmpty, length, head } from 'ramda'
import { either, warningsLength } from 'shared/utils'
import paths from 'routes/paths'
import { useHistory } from 'react-router-dom'
import { RESET_COMPONENT_MAPPING } from 'state/actions/storage'
import ContinueFooter from 'components/ESSContinueFooter'
import ErrorDetected from 'components/ESSErrorDetected'

function DeviceMappingSuccess() {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const mappingErrors = useSelector(
    pathOr([], ['storage', 'componentMapping', 'errors'])
  )
  const devices = useSelector(
    pathOr({}, ['storage', 'componentMapping', 'component_mapping'])
  )
  const retryMapping = () => {
    dispatch(RESET_COMPONENT_MAPPING())
    history.push(paths.PROTECTED.ESS_DEVICE_MAPPING.path)
  }

  const allInOneDevices = pathOr({}, ['ess_list'], devices)
  const inverter = pathOr(
    {
      device_type: t('DEVICE_MAPPING_MISSING_INVERTER'),
      serial_number: t('DEVICE_MAPPING_UNKNOWN_SERIAL_NUMBER')
    },
    ['inverter'],
    head(allInOneDevices)
  )
  const mio_board = pathOr(
    {
      device_type: t('DEVICE_MAPPING_MISSING_MIO_BOARD'),
      serial_number: t('DEVICE_MAPPING_UNKNOWN_SERIAL_NUMBER')
    },
    ['mio_board'],
    head(allInOneDevices)
  )
  const batteries = pathOr(
    {
      device_type: t('DEVICE_MAPPING_MISSING_BATTERIES'),
      serial_number: t('DEVICE_MAPPING_UNKNOWN_SERIAL_NUMBER')
    },
    ['batteries'],
    head(allInOneDevices)
  )
  const allInOneDevicesList = [mio_board, inverter, mio_board, batteries]
  const hubPlus = pathOr({}, ['hub_plus'], devices)
  const gateway = pathOr({}, ['gateway'], devices)

  return (
    <section className="is-flex tile is-vertical has-text-weight-bold pt-0 pr-10 pl-10 full-height">
      <h1 className="has-text-centered is-uppercase pb-20">
        {t('DEVICE_MAP')}
      </h1>

      {!isEmpty(allInOneDevicesList) && (
        <DeviceMap deviceList={allInOneDevicesList} />
      )}
      {!isEmpty(hubPlus) && <DeviceMap deviceList={[hubPlus]} />}
      {!isEmpty(gateway) && <DeviceMap deviceList={[gateway]} />}

      {either(
        isEmpty(mappingErrors),
        <ContinueFooter
          url={paths.PROTECTED.ESS_HEALTH_CHECK.path}
          text={'DEVICE_MAPPING_SUCCESS'}
        />,
        <ErrorDetected
          number={length(mappingErrors)}
          warnings={warningsLength(mappingErrors)}
          onRetry={retryMapping}
          url={paths.PROTECTED.ESS_DEVICE_MAPPING_ERROR_LIST.path}
          next={paths.PROTECTED.ESS_HEALTH_CHECK.path}
        />
      )}
    </section>
  )
}

export default DeviceMappingSuccess
