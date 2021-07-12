import { of, throwError } from 'rxjs'

import { acquire } from './acquire'
import { release } from './release'
import * as utils from './utilities'

import { COMMISSION_SUCCESS } from 'state/actions/analytics'
import { SET_SITE } from 'state/actions/site'
import {
  WAKELOCK_ACQUIRE_ERROR,
  WAKELOCK_ACQUIRED,
  WAKELOCK_RELEASE_ERROR,
  WAKELOCK_RELEASED
} from 'state/actions/wakelock'

describe('The wakeLock epics', function() {
  const inputMarble = 'a'
  const outputMarble = 'a'
  const releasePromisePayload = 'OK'

  it('should return WAKELOCK_ACQUIRED when the wakelock is acquired', function() {
    jest
      .spyOn(utils, 'acquireWakeLock')
      .mockImplementation(() => of(releasePromisePayload))
    const epicTest = epicTester(acquire)
    const inputValue = {
      a: SET_SITE()
    }
    const expectedValue = {
      a: WAKELOCK_ACQUIRED(releasePromisePayload)
    }
    epicTest(inputMarble, outputMarble, inputValue, expectedValue)
  })
  it('should return WAKELOCK_ACQUIRE_ERROR when the wakelock failed to released', function() {
    jest
      .spyOn(utils, 'acquireWakeLock')
      .mockImplementation(() => throwError(releasePromisePayload))
    const epicTest = epicTester(acquire)
    const inputValue = {
      a: SET_SITE()
    }
    const expectedValue = {
      a: WAKELOCK_ACQUIRE_ERROR()
    }
    epicTest(inputMarble, outputMarble, inputValue, expectedValue)
  })
  it('should return WAKELOCK_RELEASED when the wakelock is released', function() {
    jest
      .spyOn(utils, 'releaseWakeLock')
      .mockImplementation(() => of(releasePromisePayload))
    const epicTest = epicTester(release)

    const inputValue = {
      a: COMMISSION_SUCCESS()
    }
    const expectedValue = {
      a: WAKELOCK_RELEASED(releasePromisePayload)
    }
    epicTest(inputMarble, outputMarble, inputValue, expectedValue)
  })
  it('should return WAKELOCK_RELEASE_ERROR when the wakelock is released', function() {
    jest
      .spyOn(utils, 'releaseWakeLock')
      .mockImplementation(() => throwError('Failed to acquire lock'))
    const epicTest = epicTester(release)

    const inputValue = {
      a: COMMISSION_SUCCESS()
    }
    const expectedValue = {
      a: WAKELOCK_RELEASE_ERROR()
    }
    epicTest(inputMarble, outputMarble, inputValue, expectedValue)
  })
})
