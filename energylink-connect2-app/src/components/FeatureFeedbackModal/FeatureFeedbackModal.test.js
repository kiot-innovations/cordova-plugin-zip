import { shallow } from 'enzyme'
import React from 'react'
import * as reactRedux from 'react-redux'

import FeatureFeedbackModal from '.'

import * as i18n from 'shared/i18n'
import { configureStore } from 'state/store'

const featureFlagOn = {
  featureFlags: {
    featureFlags: [
      {
        lastUpdatedOn: '2020-10-01',
        name: 'ct-checks',
        page: 'feature-feedback',
        status: true
      }
    ]
  }
}

const featureFlagOff = {
  featureFlags: {
    featureFlags: [
      {
        lastUpdatedOn: '2020-10-01',
        name: 'ct-checks',
        page: 'feature-feedback',
        status: false
      }
    ]
  }
}

const featureFlagOnSending = {
  featureFlags: {
    featureFlags: [
      {
        lastUpdatedOn: '2020-10-01',
        name: 'ct-checks',
        page: 'feature-feedback',
        status: true
      }
    ]
  },
  global: {
    isSendingFeedback: true
  }
}

const featureFlagOnError = {
  featureFlags: {
    featureFlags: [
      {
        lastUpdatedOn: '2020-10-01',
        name: 'ct-checks',
        page: 'feature-feedback',
        status: true
      }
    ]
  },
  global: {
    feedbackError: true
  }
}

const featureFlagOnSent = {
  featureFlags: {
    featureFlags: [
      {
        lastUpdatedOn: '2020-10-01',
        name: 'ct-checks',
        page: 'feature-feedback',
        status: true
      }
    ]
  },
  global: {
    isFeedbackSuccessful: true
  }
}

describe('FeatureFeedbackModal component', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly when modal is open and feature flag is on', () => {
    const { store } = configureStore(featureFlagOn)
    const component = shallow(
      <reactRedux.Provider store={store}>
        <FeatureFeedbackModal
          featureFlagName="ct-checks"
          open={true}
          placeholder="This is the placeholder"
          title="This is the title"
        />
      </reactRedux.Provider>
    )
    expect(component).toMatchSnapshot()
  })

  test('renders correctly when modal is closed and feature flag is on', () => {
    const { store } = configureStore(featureFlagOn)
    const component = shallow(
      <reactRedux.Provider store={store}>
        <FeatureFeedbackModal
          featureFlagName="ct-checks"
          open={false}
          placeholder="This is the placeholder"
          title="This is the title"
        />
      </reactRedux.Provider>
    )
    expect(component).toMatchSnapshot()
  })

  test('renders correctly when modal is open and feature flag is off', () => {
    const { store } = configureStore(featureFlagOff)
    const component = shallow(
      <reactRedux.Provider store={store}>
        <FeatureFeedbackModal
          featureFlagName="ct-checks"
          open={true}
          placeholder="This is the placeholder"
          title="This is the title"
        />
      </reactRedux.Provider>
    )
    expect(component).toMatchSnapshot()
  })

  test('renders correctly when modal is open, feature flag is on and feedback is sending', () => {
    const { store } = configureStore(featureFlagOnSending)
    const component = shallow(
      <reactRedux.Provider store={store}>
        <FeatureFeedbackModal
          featureFlagName="ct-checks"
          open={true}
          placeholder="This is the placeholder"
          title="This is the title"
        />
      </reactRedux.Provider>
    )
    expect(component).toMatchSnapshot()
  })

  test('renders correctly when modal is open, feature flag is on and feedback error occurs', () => {
    const { store } = configureStore(featureFlagOnError)
    const component = shallow(
      <reactRedux.Provider store={store}>
        <FeatureFeedbackModal
          featureFlagName="ct-checks"
          open={true}
          placeholder="This is the placeholder"
          title="This is the title"
        />
      </reactRedux.Provider>
    )
    expect(component).toMatchSnapshot()
  })

  test('renders correctly when modal is open, feature flag is on and feedback is successfully sent', () => {
    const { store } = configureStore(featureFlagOnSent)
    const component = shallow(
      <reactRedux.Provider store={store}>
        <FeatureFeedbackModal
          featureFlagName="ct-checks"
          open={true}
          placeholder="This is the placeholder"
          title="This is the title"
        />
      </reactRedux.Provider>
    )
    expect(component).toMatchSnapshot()
  })
})
