import { globalReducer } from '.'
import * as mobileActions from '../../actions/mobile'
import * as userActions from '../../actions/user'

describe('Global reducer', () => {
  const initialState = {
    modal: {
      isActive: false,
      modalId: 'modal-root'
    },
    isAccountCreated: false,
    selectedEnergyGraph: userActions.GRAPHS.ENERGY
  }
  const reducerTest = reducerTester(globalReducer)

  it('returns the initial state', () => {
    reducerTest(
      initialState,
      {},
      {
        modal: {
          isActive: false,
          modalId: 'modal-root'
        },
        isAccountCreated: false,
        selectedEnergyGraph: userActions.GRAPHS.ENERGY
      }
    )
  })

  it('sets the isDeviceResumeListened flag to true when DEVICE_RESUME action is fired', () => {
    reducerTest(
      {
        some: 'existing data',
        isDeviceResumeListened: false
      },
      mobileActions.DEVICE_RESUME(),
      {
        some: 'existing data',
        isDeviceResumeListened: true
      }
    )
  })

  it('sets the selectedEnergyGraph when CREATE_ACCOUNT_SUCCESS action is fired', () => {
    reducerTest(
      {
        some: 'existing data',
        selectedEnergyGraph: userActions.GRAPHS.ENERGY
      },
      userActions.SELECT_ENERGY_GRAPH(userActions.GRAPHS.POWER),
      {
        some: 'existing data',
        selectedEnergyGraph: userActions.GRAPHS.POWER
      }
    )
  })
})
