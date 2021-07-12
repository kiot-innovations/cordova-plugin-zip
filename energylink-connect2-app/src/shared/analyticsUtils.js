import {
  __,
  compose,
  curry,
  evolve,
  gt,
  isEmpty,
  join,
  lensIndex,
  not,
  over,
  pathOr,
  pickAll,
  propSatisfies,
  toLower,
  toUpper,
  when
} from 'ramda'

import { getElapsedTime } from 'shared/utils'

export const isNotEmpty = compose(not, isEmpty)

export const capitalizeWord = when(
  propSatisfies(gt(__, 0), 'length'),
  compose(join(''), over(lensIndex(0), toUpper), toLower)
)

const stringValueOrEmptyString = stringValue => stringValue || ''

const sanitizeUserProfile = {
  uniqueId: stringValueOrEmptyString,
  firstName: stringValueOrEmptyString,
  lastName: stringValueOrEmptyString,
  email: stringValueOrEmptyString,
  dealerName: stringValueOrEmptyString,
  recordType: stringValueOrEmptyString
}

const userProfile = ['uniqueId', 'dealerName', 'recordType']

export const getUserProfile = curry(
  compose(evolve(sanitizeUserProfile), pickAll(userProfile))
)
export const getElapsedTimeWithState = curry((state, timerName) =>
  compose(
    getElapsedTime,
    pathOr(new Date().getTime(), ['value', 'analytics', timerName])
  )(state)
)
