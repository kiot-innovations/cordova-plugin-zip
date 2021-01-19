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
  pickAll,
  propSatisfies,
  toLower,
  toUpper,
  when
} from 'ramda'

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

const userProfile = [
  'uniqueId',
  'firstName',
  'lastName',
  'email',
  'dealerName',
  'recordType'
]

export const getUserProfile = curry(
  compose(evolve(sanitizeUserProfile), pickAll(userProfile))
)
