import {
  all,
  allPass,
  any,
  compose,
  equals,
  filter,
  head,
  includes,
  intersection,
  is,
  isEmpty,
  keys,
  map,
  omit,
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

const byCurrentDevicePlatform = platformStatus => {
  const currentDevicePlatform = isIos() ? 'ios' : 'android'
  const { platform } = platformStatus

  return platform === currentDevicePlatform
}

export const getCurrentDevicePlatformStatus = compose(
  propOr(false, 'status'),
  head,
  filter(byCurrentDevicePlatform)
)

function parseFeatureFlag(featureFlag) {
  const page = propOr('', 'page', featureFlag)
  const name = propOr('', 'name', featureFlag)
  const statuses = propOr([], 'statuses', featureFlag)
  const rollout = propOr({}, 'rollout', featureFlag)
  const status = getCurrentDevicePlatformStatus(statuses)
  const lastUpdatedOn = pathOr('', ['meta', 'date'], featureFlag)

  return { page, name, status, rollout, lastUpdatedOn }
}

const getFeatureFlags = propOr([], 'featureFlags')

export const getParsedFeatureFlags = compose(
  map(parseFeatureFlag),
  getFeatureFlags
)

const getFeatureFlagStatus = ({ page, name, featureFlags }) =>
  compose(
    propOr(false, 'status'),
    head,
    filter(allPass([propEq('name', name), propEq('page', page)]))
  )(featureFlags)

const getFeatureFlagRollout = ({ page, name, featureFlags }) =>
  compose(
    propOr({}, 'rollout'),
    head,
    filter(allPass([propEq('name', name), propEq('page', page)]))
  )(featureFlags)

const getRolloutStatus = (featureFlagRollout, userData) => {
  // criteria can be set to 'all' or 'any', if absent it's set to 'all'. Any
  // value other than 'all' will be interpreted as  'any'.
  const criteria = propOr('all', 'criteria', featureFlagRollout)
  const constraints = omit(['criteria'], featureFlagRollout)
  const constraintsKeys = keys(constraints)
  const userDataKeys = keys(userData)

  const checkConstraint = constraint =>
    includes(constraint, userDataKeys) && is(Array, userData[constraint])
      ? !isEmpty(intersection(userData[constraint], constraints[constraint]))
      : includes(userData[constraint], constraints[constraint])
  const constraintsResults = map(checkConstraint, constraintsKeys)
  const pass = equals(true)

  return criteria === 'all'
    ? all(pass, constraintsResults)
    : any(pass, constraintsResults)
}

export const useFeatureFlag = ({ page, name }) => {
  const featureFlags = useSelector(pathOr([], ['featureFlags', 'featureFlags']))
  const userData = useSelector(pathOr({}, ['user', 'data']))

  const featureFlagStatus = getFeatureFlagStatus({ page, name, featureFlags })
  const featureFlagRollout = getFeatureFlagRollout({ page, name, featureFlags })
  const rolloutStatus = getRolloutStatus(featureFlagRollout, userData)

  if (isEmpty(featureFlagRollout)) {
    return featureFlagStatus
  }

  return featureFlagStatus && rolloutStatus
}
