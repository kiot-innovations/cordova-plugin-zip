import * as permissionsActions from 'state/actions/permissions'
import permissionsReducer, { LOCATION_PERMISSIONS } from '.'

describe('Permissions reducer', () => {
  const reducerTest = reducerTester(permissionsReducer)
  const its = { location: LOCATION_PERMISSIONS.DENIED_ONCE, modalOpened: false }

  it('returns the same initial state if unknown action is fired', () => {
    reducerTest(its, { type: 'NONESENE' }, its)
  })

  it('resets the location key when CHECK_LOCATION_PERMISSION_INIT is fired', () => {
    reducerTest(its, permissionsActions.CHECK_LOCATION_PERMISSION_INIT(), {
      location: null,
      error: null,
      modalOpened: false,
      trackingPermission: 0
    })
  })

  it('sets the location value when CHECK_LOCATION_PERMISSION_SUCCESS is fired', () => {
    reducerTest(
      its,
      permissionsActions.CHECK_LOCATION_PERMISSION_SUCCESS(
        LOCATION_PERMISSIONS.DENIED_ALWAYS
      ),
      {
        location: LOCATION_PERMISSIONS.DENIED_ALWAYS,
        modalOpened: false
      }
    )
  })

  it('resets the location value and sets the error when CHECK_LOCATION_PERMISSION_ERROR is fired', () => {
    reducerTest(
      its,
      permissionsActions.CHECK_LOCATION_PERMISSION_ERROR(
        'UNABLE_TO_GET_PERMISSION'
      ),
      {
        location: null,
        error: 'UNABLE_TO_GET_PERMISSION',
        modalOpened: false
      }
    )
  })
})
