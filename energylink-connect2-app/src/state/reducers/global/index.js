import { createReducer } from 'redux-act'
import { TOGGLE_MODAL } from '../../actions/modal'
import { SELECT_ENERGY_GRAPH, GRAPHS } from '../../actions/user'
import { DEVICE_RESUME } from '../../actions/mobile'

const defaultModalId = 'modal-root'

const initialState = {
  modal: {
    isActive: false,
    modalId: defaultModalId
  },
  isAccountCreated: false,
  isDeviceResumeListened: false,
  selectedEnergyGraph: GRAPHS.ENERGY
}

export const globalReducer = createReducer(
  {
    [TOGGLE_MODAL]: (state, { isActive, modalId = defaultModalId }) => ({
      ...state,
      modal: {
        isActive,
        modalId
      }
    }),
    [SELECT_ENERGY_GRAPH]: (state, action) => ({
      ...state,
      selectedEnergyGraph: action
    }),
    [DEVICE_RESUME]: state => ({ ...state, isDeviceResumeListened: true })
  },
  initialState
)
