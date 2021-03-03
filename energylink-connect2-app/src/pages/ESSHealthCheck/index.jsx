import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  add,
  isEmpty,
  isNil,
  length,
  path,
  pathOr,
  pluck,
  propOr,
  reduce
} from 'ramda'
import { addHasErrorProp, warningsLength } from 'shared/utils'
import { GET_ESS_STATUS_INIT, RUN_EQS_SYSTEMCHECK } from 'state/actions/storage'
import { RESET_DISCOVERY } from 'state/actions/devices'
import {
  SUBMIT_CLEAR,
  SUBMIT_CONFIG_SUCCESS,
  ALLOW_COMMISSIONING
} from 'state/actions/systemConfiguration'
import paths from 'routes/paths'
import ESSHealthCheckComponent from 'components/ESSHealthCheck'

function ESSHealthCheck() {
  const dispatch = useDispatch()
  const history = useHistory()
  const unblockHandle = useRef()

  const [waitModal, showWaitModal] = useState(false)
  const { rmaMode } = useSelector(state => state.rma)
  const { waiting, results, error } = useSelector(state => state.storage.status)
  const { progress } = useSelector(state => state.devices)
  const { canCommission } = useSelector(path(['systemConfiguration', 'submit']))
  const rmaPvs = useSelector(path(['rma', 'pvs']))

  const discoveryProgress = propOr([], 'progress', progress)
  const deviceProgress = pluck('PROGR', discoveryProgress)
  const deviceStartProgress =
    waiting && deviceProgress === 100 ? 0 : deviceProgress
  const overallProgress = Math.floor(
    reduce(add, 0, deviceStartProgress) / length(deviceProgress)
  )
  const { submitting, commissioned, error: syncError } = useSelector(
    pathOr({}, ['systemConfiguration', 'submit'])
  )

  const report = addHasErrorProp(results)
  const errors = pathOr([], ['errors'], report)
  const hasErrors = !isEmpty(errors) || error

  useEffect(() => {
    unblockHandle.current = history.block(() => {
      if (waiting) {
        showWaitModal(true)
        return false
      }
    })
    return function() {
      unblockHandle.current && unblockHandle.current()
    }
  }, [unblockHandle, history, showWaitModal, waiting])

  useEffect(() => {
    if (
      results &&
      warningsLength(errors) === length(errors) &&
      canCommission === false
    )
      dispatch(ALLOW_COMMISSIONING())
  }, [canCommission, dispatch, errors, hasErrors, results])

  useEffect(() => {
    if (isEmpty(results) || isNil(results)) {
      dispatch(RESET_DISCOVERY())
      dispatch(GET_ESS_STATUS_INIT())
    }
  }, [dispatch, report, results])

  const onRetry = () =>
    discoveryProgress === 100
      ? dispatch(RUN_EQS_SYSTEMCHECK())
      : dispatch(GET_ESS_STATUS_INIT())

  const pathToContinue = rmaPvs
    ? paths.PROTECTED.SYSTEM_CONFIGURATION.path
    : paths.PROTECTED.INSTALL_SUCCESS.path

  const pathToErrors = paths.PROTECTED.ESS_HEALTH_CHECK_ERRORS.path

  const syncWithCloud = () => {
    dispatch(SUBMIT_CLEAR())
    dispatch(SUBMIT_CONFIG_SUCCESS())
  }

  const clearAndContinue = () => {
    dispatch(SUBMIT_CLEAR())
    history.push(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
  }

  return (
    <ESSHealthCheckComponent
      waiting={waiting}
      progress={overallProgress}
      results={results}
      error={error}
      onRetry={onRetry}
      pathToContinue={pathToContinue}
      pathToErrors={pathToErrors}
      rmaMode={rmaMode}
      sync={syncWithCloud}
      clear={clearAndContinue}
      submitting={submitting}
      commissioned={commissioned}
      syncError={syncError}
      waitModal={waitModal}
      showWaitModal={showWaitModal}
    />
  )
}

export default ESSHealthCheck
