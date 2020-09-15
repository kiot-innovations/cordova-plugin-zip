// Based on parse function from https://github.com/motdotla/dotenv
const {
  compose,
  countBy,
  identity,
  inc,
  mapObjIndexed,
  propOr
} = require('ramda')

const NEWLINE = '\n'
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
const RE_NEWLINES = /\\n/g
const NEWLINES_MATCH = /\n|\r|\r\n/

const keyAlreadyExist = (key, config) => propOr(null, key, config) !== null
const increaseByOne = value => inc(value)
const groupDuplicatedKeys = compose(
  mapObjIndexed(increaseByOne),
  countBy(identity)
)

const parse = content => {
  const config = {}
  const duplicatedKeys = []

  content
    .toString()
    .split(NEWLINES_MATCH)
    .forEach(function(line, idx) {
      const keyValueArr = line.match(RE_INI_KEY_VAL)
      if (keyValueArr != null) {
        const key = keyValueArr[1]
        let val = keyValueArr[2] || ''
        const end = val.length - 1
        const isDoubleQuoted = val[0] === '"' && val[end] === '"'
        const isSingleQuoted = val[0] === "'" && val[end] === "'"

        if (isSingleQuoted || isDoubleQuoted) {
          val = val.substring(1, end)

          if (isDoubleQuoted) {
            val = val.replace(RE_NEWLINES, NEWLINE)
          }
        } else {
          val = val.trim()
        }

        if (keyAlreadyExist(key, config)) {
          duplicatedKeys.push(key)
        }

        config[key] = val
      }
    })

  return { config, duplicatedKeys: groupDuplicatedKeys(duplicatedKeys) }
}

exports.parse = parse
