import { SET_FOOTER } from 'state/actions/ui'

const initialState = false

export default (state = initialState, action) => {
  const { type, payload } = action
  if (type === SET_FOOTER) return payload
  return state
}
