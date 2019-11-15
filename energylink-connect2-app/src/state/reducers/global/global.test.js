import * as modalActions from '../../actions/modal'
import * as authActions from '../../actions/auth'
import * as userActions from '../../actions/user'
import * as mobileActions from '../../actions/mobile'

import { globalReducer } from '.'

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

  it('changes default modal to active when TOGGLE_MODAL action is fired', () => {
    reducerTest({ modal: {} }, modalActions.TOGGLE_MODAL({ isActive: true }), {
      modal: {
        isActive: true,
        modalId: 'modal-root'
      }
    })
  })

  it('changes specific modal to active when TOGGLE_MODAL action is fired', () => {
    reducerTest(
      { modal: {} },
      modalActions.TOGGLE_MODAL({ isActive: true, modalId: 'custom-modal' }),
      {
        modal: {
          isActive: true,
          modalId: 'custom-modal'
        }
      }
    )
  })

  it('sets the isAccountCreated flag to false when CREATE_ACCOUNT_INIT action is fired', () => {
    reducerTest(
      {
        some: 'existing data',
        isAccountCreated: true
      },
      authActions.CREATE_ACCOUNT_INIT(),
      {
        some: 'existing data',
        isAccountCreated: false
      }
    )
  })

  it('sets the isAccountCreated flag to true when CREATE_ACCOUNT_SUCCESS action is fired', () => {
    reducerTest(
      {
        some: 'existing data',
        isAccountCreated: false
      },
      authActions.CREATE_ACCOUNT_SUCCESS(),
      {
        some: 'existing data',
        isAccountCreated: true
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
