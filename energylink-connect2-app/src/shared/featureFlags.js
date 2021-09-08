import {
  allPass,
  compose,
  filter,
  head,
  map,
  pathOr,
  propEq,
  propOr
} from 'ramda'
import { useSelector } from 'react-redux'

import { isIos } from 'shared/utils'

export const featureFlagsUrl = process.env.REACT_APP_FEATURE_FLAGS_URL

// Value in seconds, for a 5 minutes delay use 5 * 60 or 300 seconds
export const DELAY_BEFORE_UPDATE = 5 * 60

export const status = {
  NEVER_FETCHED: 'neverFetched',
  FETCHED: 'fetched',
  UNKNOWN: 'unknown'
}

export const getLastSuccessfulUpdate = pathOr(0, [
  'value',
  'featureFlags',
  'lastSuccessfulUpdateOn'
])

export const getStatus = pathOr(status.UNKNOWN, [
  'value',
  'featureFlags',
  'status'
])

const getDeviceStatus = deviceStatus => {
  const devicePlatform = isIos() ? 'ios' : 'android'
  const { platform } = deviceStatus

  return platform === devicePlatform
}

export const getFeatureFlagStatus = compose(
  propOr(false, 'status'),
  head,
  filter(getDeviceStatus)
)

function parseFeatureFlag(featureFlag) {
  const page = propOr('', 'page', featureFlag)
  const name = propOr('', 'name', featureFlag)
  const statuses = propOr([], 'statuses', featureFlag)
  const status = getFeatureFlagStatus(statuses)
  const lastUpdatedOn = pathOr('', ['meta', 'date'], featureFlag)

  return { page, name, status, lastUpdatedOn }
}

const getFeatureFlags = propOr([], 'featureFlags')

export const getParsedFeatureFlags = compose(
  map(parseFeatureFlag),
  getFeatureFlags
)

const getFeatureFlag = ({ page, name, featureFlags }) =>
  compose(
    propOr(false, 'status'),
    head,
    filter(allPass([propEq('name', name), propEq('page', page)]))
  )(featureFlags)

export const useFeatureFlag = ({ page, name }) => {
  const featureFlags = useSelector(pathOr([], ['featureFlags', 'featureFlags']))

  return getFeatureFlag({ page, name, featureFlags })
}
