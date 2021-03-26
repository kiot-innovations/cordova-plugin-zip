import {
  submitPreConfigGridProfileEpic,
  submitPreConfigMeterDataEpic
} from './submitPreconfigurationEpic'
import {
  SUBMIT_PRECONFIG_SUCCESS,
  SUBMIT_PRECONFIG_ERROR,
  SUBMIT_PRECONFIG_GRIDPROFILE,
  SUBMIT_PRECONFIG_METER
} from 'state/actions/systemConfiguration'
import { of, throwError } from 'rxjs'
import * as epicFunctions from './epicFunctions'

describe('Precommissioning - Submit Grid Profile', function() {
  const state = {
    language: {
      locale: 'en'
    }
  }

  it('should return SUBMIT_PRECONFIG_METER if successful grid profile submitted', function() {
    const submitGridProfileMock = jest.fn(() =>
      of({
        status: 200,
        body: {}
      })
    )

    epicFunctions.submitGridProfile = submitGridProfileMock

    const epicTest = epicTester(submitPreConfigGridProfileEpic)

    const payload = {
      gridProfile: 'a_grid_profile',
      lazy: true
    }

    const inputValue = { a: SUBMIT_PRECONFIG_GRIDPROFILE(payload) }
    const inputMarble = 'a'

    const outputValue = {
      a: SUBMIT_PRECONFIG_METER(payload)
    }
    const outputMarble = 'a'

    epicTest(inputMarble, outputMarble, inputValue, outputValue, state)
  })
  it('should fail if no grid profile was submitted', function() {
    const epicTest = epicTester(submitPreConfigGridProfileEpic)

    const inputValue = { a: SUBMIT_PRECONFIG_GRIDPROFILE({}) }
    const inputMarble = 'a'

    const outputValue = {
      a: SUBMIT_PRECONFIG_ERROR('Error while setting grid profile')
    }
    const outputMarble = 'a'

    epicTest(inputMarble, outputMarble, inputValue, outputValue, state)
  })
  it('should return an error if a non 200 status is reported while submitting grid profile', function() {
    const submitGridProfileMock = jest.fn(() =>
      of({
        status: 400,
        body: {}
      })
    )

    epicFunctions.submitGridProfile = submitGridProfileMock

    const epicTest = epicTester(submitPreConfigGridProfileEpic)

    const payload = {
      gridProfile: 'a_grid_profile',
      lazy: true
    }

    const inputValue = { a: SUBMIT_PRECONFIG_GRIDPROFILE(payload) }
    const inputMarble = 'a'

    const outputValue = {
      a: SUBMIT_PRECONFIG_ERROR('Error while setting grid profile')
    }
    const outputMarble = 'a'

    epicTest(inputMarble, outputMarble, inputValue, outputValue, state)
  })
  it('should return error if grid profile submitting fails', function() {
    const submitGridProfileMock = jest.fn(() =>
      throwError(new Error('Hi, this is a failure.'))
    )

    epicFunctions.submitGridProfile = submitGridProfileMock

    const epicTest = epicTester(submitPreConfigGridProfileEpic)

    const payload = {
      gridProfile: 'a_grid_profile',
      lazy: true
    }

    const inputValue = { a: SUBMIT_PRECONFIG_GRIDPROFILE(payload) }
    const inputMarble = 'a'

    const outputValue = {
      a: SUBMIT_PRECONFIG_ERROR('Error while setting grid profile')
    }
    const outputMarble = 'a'

    epicTest(inputMarble, outputMarble, inputValue, outputValue, state)
  })
})

describe('Precommissioning - Submit Meter Settings', function() {
  const state = {
    language: {
      locale: 'en'
    }
  }
  it('should return SUBMIT_PRECONFIG_SUCCESS after a 200 response', function() {
    const submitMeterConfigurationsMock = jest.fn(() =>
      of({
        status: 200,
        body: {}
      })
    )

    const epicTest = epicTester(submitPreConfigMeterDataEpic)

    epicFunctions.submitMeterConfigurations = submitMeterConfigurationsMock

    const payload = {
      metaData: {}
    }

    const inputValue = { a: SUBMIT_PRECONFIG_METER(payload) }
    const inputMarble = 'a'

    const outputValue = {
      a: SUBMIT_PRECONFIG_SUCCESS({
        status: 200,
        body: {}
      })
    }
    const outputMarble = 'a'

    epicTest(inputMarble, outputMarble, inputValue, outputValue, state)
  })
  it('should fail if no meter data was submitted', function() {
    const epicTest = epicTester(submitPreConfigMeterDataEpic)

    const inputValue = { a: SUBMIT_PRECONFIG_METER({}) }
    const inputMarble = 'a'

    const outputValue = {
      a: SUBMIT_PRECONFIG_ERROR(
        'There was an error while saving the meter configurations, please try again'
      )
    }
    const outputMarble = 'a'

    epicTest(inputMarble, outputMarble, inputValue, outputValue, state)
  })
  it('should return an error if a non 200 status is reported while submitting meter data', function() {
    const submitMeterConfigurationsMock = jest.fn(() =>
      of({
        status: 400,
        body: {}
      })
    )

    epicFunctions.submitMeterConfigurations = submitMeterConfigurationsMock

    const payload = {
      metaData: {}
    }

    const inputValue = { a: SUBMIT_PRECONFIG_METER(payload) }
    const inputMarble = 'a'

    const epicTest = epicTester(submitPreConfigMeterDataEpic)

    const outputValue = {
      a: SUBMIT_PRECONFIG_ERROR(
        'There was an error while saving the meter configurations, please try again'
      )
    }
    const outputMarble = 'a'

    epicTest(inputMarble, outputMarble, inputValue, outputValue, state)
  })
  it('should return an error if meter configuration submitting fails', function() {
    const submitMeterConfigurationsMock = jest.fn(() =>
      throwError(new Error('Hi, this is a failure.'))
    )

    const payload = {
      metaData: {}
    }

    epicFunctions.submitMeterConfigurations = submitMeterConfigurationsMock

    const epicTest = epicTester(submitPreConfigMeterDataEpic)

    const inputValue = { a: SUBMIT_PRECONFIG_METER(payload) }
    const inputMarble = 'a'

    const outputValue = {
      a: SUBMIT_PRECONFIG_ERROR(
        'There was an error while saving the meter configurations, please try again'
      )
    }
    const outputMarble = 'a'

    epicTest(inputMarble, outputMarble, inputValue, outputValue, state)
  })
})
