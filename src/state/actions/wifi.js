import { createAction } from 'redux-act'
import { httpGet, httpPost } from '../../shared/fetch'

export const WIFI_COLLECTOR_INIT = createAction('WIFI_COLLECTOR_INIT')
export const WIFI_COLLECTOR_SUCCESS = createAction('WIFI_COLLECTOR_SUCCESS')
export const WIFI_COLLECTOR_ERROR = createAction('WIFI_COLLECTOR_ERROR')

export const getWifiCollector = (fetchStatus = true) => {
  return async (dispatch, getState) => {
    try {
      const state = getState()
      const addressId = state.user.auth.addressId
      const hasWifiInitialData = state.wifi.hasWifiInitialData
      if (!hasWifiInitialData) {
        dispatch(WIFI_COLLECTOR_INIT())
        const { status, data } = await httpGet(
          `/wifi/collector?addressId=${addressId}`,
          state
        )
        if (status === 200) {
          dispatch(WIFI_COLLECTOR_SUCCESS(data))
          if (fetchStatus) {
            dispatch(getWifiStatus(data.ComponentSerialNumber))
          }
        } else {
          dispatch(WIFI_COLLECTOR_ERROR(data))
        }
      }
    } catch (err) {
      dispatch(WIFI_COLLECTOR_ERROR(err))
    }
  }
}

export const WIFI_STATUS_INIT = createAction('WIFI_STATUS_INIT')
export const WIFI_STATUS_SUCCESS = createAction('WIFI_STATUS_SUCCESS')
export const WIFI_STATUS_ERROR = createAction('WIFI_STATUS_ERROR')

export const getWifiStatus = (serialNumber = null) => {
  return async (dispatch, getState) => {
    try {
      dispatch(WIFI_STATUS_INIT())
      const state = getState()
      serialNumber = serialNumber || state.wifi.collector.ComponentSerialNumber
      const { status, data } = await httpGet(
        `/wifi/status?serialNumber=${serialNumber}`,
        state
      )
      return status === 200
        ? dispatch(WIFI_STATUS_SUCCESS(data))
        : dispatch(WIFI_STATUS_ERROR(data))
    } catch (err) {
      dispatch(WIFI_STATUS_ERROR(err))
    }
  }
}

export const WIFI_NETWORKS_INIT = createAction('WIFI_NETWORKS_INIT')
export const WIFI_NETWORKS_SUCCESS = createAction('WIFI_NETWORKS_SUCCESS')
export const WIFI_NETWORKS_ERROR = createAction('WIFI_NETWORKS_ERROR')

export const getWifiNetworks = (serialNumber = null, scan = false) => {
  return async (dispatch, getState) => {
    try {
      dispatch(WIFI_NETWORKS_INIT())
      const state = getState()
      serialNumber = serialNumber || state.wifi.collector.ComponentSerialNumber
      const { status, data } = await httpGet(
        `/wifi/networks?serialNumber=${serialNumber}&scan=${scan}`,
        state
      )
      return status === 200
        ? dispatch(WIFI_NETWORKS_SUCCESS(data))
        : dispatch(WIFI_NETWORKS_ERROR(data))
    } catch (err) {
      dispatch(WIFI_NETWORKS_ERROR(err))
    }
  }
}

export const WIFI_SET_INIT = createAction('WIFI_SET_INIT')
export const WIFI_SET_SUCCESS = createAction('WIFI_SET_SUCCESS')
export const WIFI_SET_ERROR = createAction('WIFI_SET_ERROR')

export const setWifiNetwork = values => {
  return async dispatch => {
    try {
      dispatch(WIFI_SET_INIT())
      const { status, data } = await httpPost('/wifi/setNetwork', {
        SSID: values.SSID,
        password: values.password,
        serialNumber: values.serialNumber
      })
      return status === 200
        ? dispatch(WIFI_SET_SUCCESS(data))
        : dispatch(WIFI_SET_ERROR(data))
    } catch (err) {
      dispatch(WIFI_SET_ERROR(err))
    }
  }
}

export const WIFI_COMMAND_STATUS_INIT = createAction('WIFI_COMMAND_STATUS_INIT')
export const WIFI_COMMAND_STATUS_SUCCESS = createAction(
  'WIFI_COMMAND_STATUS_SUCCESS'
)
export const WIFI_COMMAND_STATUS_ERROR = createAction(
  'WIFI_COMMAND_STATUS_ERROR'
)

export const getWifiCommandStatus = (tokenNumber, serialNumber = null) => {
  return async (dispatch, getState) => {
    try {
      dispatch(WIFI_COMMAND_STATUS_INIT())
      const state = getState()
      serialNumber = serialNumber || state.wifi.collector.ComponentSerialNumber
      const { status, data } = await httpGet(
        `/wifi/setNetwork/status?serialNumber=${serialNumber}&tokenNumber=${tokenNumber}`,
        state
      )
      return status === 200
        ? dispatch(WIFI_COMMAND_STATUS_SUCCESS(data))
        : dispatch(WIFI_COMMAND_STATUS_ERROR(data))
    } catch (err) {
      dispatch(WIFI_COMMAND_STATUS_ERROR(err))
    }
  }
}
