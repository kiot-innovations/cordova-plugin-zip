import React from 'react'
import { length } from 'ramda'
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'

import ErrorDetected from '.'
import { warningsLength, withoutInfoCodes } from 'shared/utils'

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
    error_code: '31007'
  },
  {
    error_code: '11018'
  },
  {
    error_code: '01003'
  }
]

const onRetry = linkTo('ErrorDetected Component', 'Generating report')

const noInfojustErrors = withoutInfoCodes(justErrors)
const warningsCountjustErrors = warningsLength(noInfojustErrors)
const errorsDetectedjustErrors =
  length(noInfojustErrors) - warningsCountjustErrors

const noInfoJustWarnings = withoutInfoCodes(justWarnings)
const warningsCountjustWarnings = warningsLength(noInfoJustWarnings)
const errorsDetectedjustWarnings =
  length(noInfoJustWarnings) - warningsCountjustWarnings

const noInfoBoth = withoutInfoCodes(both)
const warningsCountBoth = warningsLength(noInfoBoth)
const errorsDetectedBoth = length(noInfoBoth) - warningsCountBoth

storiesOf('ErrorDetected Component', module)
  .add('With Just Errors', () => (
    <div className="full-min-height pl-10 pr-10">
      <ErrorDetected
        number={errorsDetectedjustErrors}
        warnings={warningsCountjustErrors}
        onRetry={onRetry}
        url="Error List"
        next="Continue Link"
      />
    </div>
  ))
  .add('With Just Warnings', () => (
    <div className="full-min-height pl-10 pr-10">
      <ErrorDetected
        number={errorsDetectedjustWarnings}
        warnings={warningsCountjustWarnings}
        onRetry={onRetry}
        url="Error List"
        next="Continue Link"
      />
    </div>
  ))
  .add('With Both Errors and Warnings', () => (
    <div className="full-min-height pl-10 pr-10">
      <ErrorDetected
        number={errorsDetectedBoth}
        warnings={warningsCountBoth}
        onRetry={onRetry}
        url="Error List"
        next="Continue Link"
      />
    </div>
  ))
