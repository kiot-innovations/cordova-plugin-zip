import React from 'react'

import ErrorListGeneric from '.'

import * as i18n from 'shared/i18n'
import { eqsSteps } from 'state/reducers/storage'

describe('ErrorListGeneric page', () => {
  const provider = {
    storage: {
      currentStep: eqsSteps.PREDISCOVERY
    }
  }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const component = mountWithProvider(<ErrorListGeneric />)(provider)
    expect(component).toMatchSnapshot()
  })
})