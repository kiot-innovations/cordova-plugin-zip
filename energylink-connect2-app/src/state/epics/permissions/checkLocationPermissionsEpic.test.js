import { of, throwError } from 'rxjs'
import {
  CHECK_LOCATION_PERMISSION_INIT,
  CHECK_LOCATION_PERMISSION_SUCCESS,
  CHECK_LOCATION_PERMISSION_ERROR
} from 'state/actions/permissions'
import { LOCATION_PERMISSIONS } from 'state/reducers/permissions'

import * as permissionsChecker from 'shared/permissionsChecker'
import { SHOW_MODAL, HIDE_MODAL } from 'state/actions/modal'

describe('checkLocationPermissionsEpic', () => {
  beforeEach(() => {
    jest
      .spyOn(permissionsChecker, 'checkLocationPermissions')
      .mockImplementation(() => of(LOCATION_PERMISSIONS.DENIED_ONCE))
  })

  it('it should return a CHECK_LOCATION_PERMISSION_SUCCESS when the action is fired', () => {
    const epicTest = epicTester(
      require('./checkLocationPermissionsEpic').checkLocationPermissionsEpic
    )

    const inputAction = {
      i: CHECK_LOCATION_PERMISSION_INIT()
    }

    const outputAction = {
      o: CHECK_LOCATION_PERMISSION_SUCCESS(LOCATION_PERMISSIONS.DENIED_ONCE)
    }

    const inputMarble = 'i'
    const outputMarble = 'o'

    epicTest(inputMarble, outputMarble, inputAction, outputAction)
  })

  it('it should return a CHECK_LOCATION_PERMISSION_ERROR action when the fn rejects', () => {
    jest
      .spyOn(permissionsChecker, 'checkLocationPermissions')
      .mockImplementation(() => throwError('UNDEFINED_METHOD'))

    const epicTest = epicTester(
      require('./checkLocationPermissionsEpic').checkLocationPermissionsEpic
    )

    const inputAction = {
      i: CHECK_LOCATION_PERMISSION_INIT()
    }

    const outputAction = {
      o: CHECK_LOCATION_PERMISSION_ERROR('UNDEFINED_METHOD')
    }

    const inputMarble = 'i'
    const outputMarble = 'o'

    epicTest(inputMarble, outputMarble, inputAction, outputAction)
  })

  it('it should return a SHOW_MODAL action if permission is denied or not requested', () => {
    const epicTest = epicTester(
      require('./checkLocationPermissionsEpic').showLocationPermissionModalEpic
    )

    const state = {
      permissions: {
        location: null
      },
      modal: {
        show: false
      }
    }

    const inputAction = {
      i: CHECK_LOCATION_PERMISSION_SUCCESS(LOCATION_PERMISSIONS.NOT_REQUESTED)
    }

    const outputAction = {
      o: SHOW_MODAL({
        title: 'We need location permissions',
        componentPath: './AskForLocationPermissionModal.jsx'
      })
    }

    const inputMarble = 'i'
    const outputMarble = 'o'

    epicTest(inputMarble, outputMarble, inputAction, outputAction, state)
  })

  it('it should return a HIDE_MODAL action if permission is enabled', () => {
    const epicTest = epicTester(
      require('./checkLocationPermissionsEpic').showLocationPermissionModalEpic
    )

    const state = {
      permissions: {
        location: null
      },
      modal: {
        show: true,
        title: 'We need location permissions'
      }
    }

    const inputAction = {
      i: CHECK_LOCATION_PERMISSION_SUCCESS(LOCATION_PERMISSIONS.WHILE_IN_USE)
    }

    const outputAction = {
      o: HIDE_MODAL()
    }

    const inputMarble = 'i'
    const outputMarble = 'o'

    epicTest(inputMarble, outputMarble, inputAction, outputAction, state)
  })
})
