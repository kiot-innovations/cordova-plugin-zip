import { shallow } from 'enzyme'
import { length } from 'ramda'
import React from 'react'

import ErrorDetected from '.'

import * as i18n from 'shared/i18n'
import { warningsLength } from 'shared/utils'

describe('ErrorDetected component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  const justErrors = [
    {
      error_code: '32058'
    },
    {
      error_code: '31018'
    },
    {
      error_code: '31003'
    }
  ]
  const justWarnings = [
    {
      error_code: '12058'
    },
    {
      error_code: '11018'
    },
    {
      error_code: '11003'
    }
  ]
  const both = [
    {
      error_code: '12058'
    },
    {
      error_code: '31018'
    },
    {
      error_code: '11003'
    }
  ]

  test('render correctly when errors', () => {
    const component = shallow(
      <ErrorDetected
        number={length(justErrors) - warningsLength(justErrors)}
        warnings={warningsLength(justErrors)}
        url="Error List"
        next="Continue Link"
      />
    )
    expect(component).toMatchSnapshot()
  })

  test('render correctly when warnings', () => {
    const component = shallow(
      <ErrorDetected
        number={length(justWarnings) - warningsLength(justWarnings)}
        warnings={warningsLength(justWarnings)}
        url="Error List"
        next="Continue Link"
      />
    )
    expect(component).toMatchSnapshot()
  })

  test('render correctly when errors and warnings', () => {
    const component = shallow(
      <ErrorDetected
        number={length(both) - warningsLength(both)}
        warnings={warningsLength(both)}
        url="Error List"
        next="Continue Link"
      />
    )
    expect(component).toMatchSnapshot()
  })

  test('render correctly when a global status error happens', () => {
    const component = shallow(
      <ErrorDetected
        number={0}
        warnings={0}
        globalError="Make sure you have run discovery successful completion"
        url="Error List"
        next="Continue Link"
      />
    )
    expect(component).toMatchSnapshot()
  })
})
