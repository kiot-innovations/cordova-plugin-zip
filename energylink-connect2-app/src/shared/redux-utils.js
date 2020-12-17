import { createAction } from 'redux-act'
import { curry } from 'ramda'

export const namedAction = curry((moduleName, actionName) =>
  createAction(`[ ${moduleName} ] - ${actionName}`)
)
