import React from 'react'

import TutorialVideo from '.'

import * as i18n from 'shared/i18n'

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    history: {
      goBack: jest.fn(),
      push: jest.fn()
    }
  })
}))

describe('TutorialVideo component', () => {
  const provider = {
    knowledgeBase: {
      currentTutorial: {
        title: 'Downloading firmware',
        video: 'https://vimeo.com/586055338'
      }
    }
  }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<TutorialVideo />)(provider)
    expect(component).toMatchSnapshot()
  })
})
