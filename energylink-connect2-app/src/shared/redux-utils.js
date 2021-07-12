import { curry } from 'ramda'
import { createAction } from 'redux-act'

export const namedAction = curry((moduleName, actionName) =>
  createAction(`[ ${moduleName} ] - ${actionName}`)
)
