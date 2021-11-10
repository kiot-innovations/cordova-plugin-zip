import React from 'react'
import * as reactRedux from 'react-redux'

import TutorialVideoList from '.'

import * as i18n from 'shared/i18n'

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    history: {
      goBack: jest.fn(),
      push: jest.fn()
    }
  })
}))

describe('TutorialVideoList component', () => {
  const provider = {
    knowledgeBase: {
      tutorialList: [
        {
          title: 'Downloading firmware',
          video: 'https://vimeo.com/586055338'
        },
        {
          title: 'Connect + Update firmware',
          video: 'https://vimeo.com/586055438'
        },
        {
          title: 'Discover + claim',
          video: 'https://vimeo.com/586055515'
        },
        {
          title: 'Configure system',
          video: 'https://vimeo.com/586055576'
        }
      ],
      currentTutorial: {},
      status: 'fetched',
      lastSuccessfulUpdateOn: 0
    }
  }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn)
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<TutorialVideoList />)(provider)
    expect(component).toMatchSnapshot()
  })
})
