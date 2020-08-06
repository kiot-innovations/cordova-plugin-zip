import React from 'react'
import { length } from 'ramda'
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'

import ErrorDetected from '.'
import { warningsLength } from 'shared/utils'

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

const onRetry = linkTo('ErrorDetected Component', 'Generating report')

storiesOf('ErrorDetected Component', module)
  .add('With Just Errors', () => (
    <div className="full-min-height pl-10 pr-10">
      <ErrorDetected
        number={length(justErrors) - warningsLength(justErrors)}
        warnings={warningsLength(justErrors)}
        onRetry={onRetry}
        url="Error List"
        next="Continue Link"
      />
    </div>
  ))
  .add('With Just Warnings', () => (
    <div className="full-min-height pl-10 pr-10">
      <ErrorDetected
        number={length(justWarnings) - warningsLength(justWarnings)}
        warnings={warningsLength(justWarnings)}
        onRetry={onRetry}
        url="Error List"
        next="Continue Link"
      />
    </div>
  ))
  .add('With Both Errors and Warnings', () => (
    <div className="full-min-height pl-10 pr-10">
      <ErrorDetected
        number={length(both) - warningsLength(both)}
        warnings={warningsLength(both)}
        onRetry={onRetry}
        url="Error List"
        next="Continue Link"
      />
    </div>
  ))
