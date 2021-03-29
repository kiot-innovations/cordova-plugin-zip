import { ofType } from 'redux-observable'
import { SAVE_INVENTORY_SUCCESS } from 'state/actions/inventory'
import { map } from 'rxjs/operators'
import {
  assoc,
  compose,
  curry,
  head,
  map as rmap,
  not,
  prop,
  propEq,
  split
} from 'ramda'
import { arrayToObject } from 'shared/utils'
import { saveInventory } from 'shared/analytics'

export const parsePropertyToNumber = curry((key, obj) =>
  assoc(key, Number(prop(key, obj)), obj)
)
export const parseESSValue = obj => {
  const parseString = compose(head, split(' ('))
  return assoc('ESS', parseString(prop('ESS', obj)), obj)
}

export const parseInventory = compose(
  parseESSValue,
  parsePropertyToNumber('AC_MODULES'),
  rmap(prop('value')),
  arrayToObject('item')
)

const sendInventoryEpic = action$ =>
  action$.pipe(
    ofType(SAVE_INVENTORY_SUCCESS.getType()),
    map(({ payload }) => {
      const inventory = parseInventory(payload)
      const hasESS = not(propEq('ESS', '0', inventory))
      return saveInventory(inventory, hasESS)
    })
  )

export default [sendInventoryEpic]
