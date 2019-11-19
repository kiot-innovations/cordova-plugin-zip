import { SET_HEADER } from 'state/actions/ui'

const initialState = false

export default (state = initialState, action) => {
  const { type, payload } = action
  if (type === SET_HEADER) return payload
  return state
}
