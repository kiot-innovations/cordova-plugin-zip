import {
  __,
  compose,
  curry,
  gt,
  isEmpty,
  join,
  lensIndex,
  map,
  not,
  over,
  props,
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

const getStringProps = curry(compose(map(stringValueOrEmptyString), props))

export const getUserProfile = getStringProps([
  'uniqueId',
  'firstName',
  'lastName',
  'email',
  'dealerName',
  'recordType'
])
