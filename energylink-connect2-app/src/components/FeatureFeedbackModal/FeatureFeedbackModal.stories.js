import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import FeatureFeedbackModal from '.'

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

storiesOf('FeatureFeedbackModal', module)
  .add('Open and feature flag on', () => {
    const { store } = configureStore(featureFlagOn)

    return (
      <Provider store={store}>
        <h1 className="mt-10 mb-10 has-text-centered is-uppercase">
          Feature feedback modal
        </h1>

        <div className="full-min-height pl-10 pr-10">
          <FeatureFeedbackModal
            featureFlagName="ct-checks"
            open={true}
            placeholder="This is the placeholder"
            title="This is the title"
          />
        </div>
      </Provider>
    )
  })
  .add('Closed and feature flag on', () => {
    const { store } = configureStore(featureFlagOn)

    return (
      <Provider store={store}>
        <h1 className="mt-10 mb-10 has-text-centered is-uppercase">
          Feature feedback modal
        </h1>

        <div className="full-min-height pl-10 pr-10">
          <FeatureFeedbackModal
            featureFlagName="ct-checks"
            open={false}
            placeholder="This is the placeholder"
            title="This is the title"
          />
        </div>
      </Provider>
    )
  })
  .add('Open and feature flag off', () => {
    const { store } = configureStore(featureFlagOff)

    return (
      <Provider store={store}>
        <h1 className="mt-10 mb-10 has-text-centered is-uppercase">
          Feature feedback modal
        </h1>

        <div className="full-min-height pl-10 pr-10">
          <FeatureFeedbackModal
            featureFlagName="ct-checks"
            open={true}
            placeholder="This is the placeholder"
            title="This is the title"
          />
        </div>
      </Provider>
    )
  })
  .add('Open and feature flag on, sending feedback', () => {
    const { store } = configureStore(featureFlagOnSending)

    return (
      <Provider store={store}>
        <h1 className="mt-10 mb-10 has-text-centered is-uppercase">
          Feature feedback modal
        </h1>

        <div className="full-min-height pl-10 pr-10">
          <FeatureFeedbackModal
            featureFlagName="ct-checks"
            open={true}
            placeholder="This is the placeholder"
            title="This is the title"
          />
        </div>
      </Provider>
    )
  })
  .add('Open and feature flag on, sending feedback error', () => {
    const { store } = configureStore(featureFlagOnError)

    return (
      <Provider store={store}>
        <h1 className="mt-10 mb-10 has-text-centered is-uppercase">
          Feature feedback modal
        </h1>

        <div className="full-min-height pl-10 pr-10">
          <FeatureFeedbackModal
            featureFlagName="ct-checks"
            open={true}
            placeholder="This is the placeholder"
            title="This is the title"
          />
        </div>
      </Provider>
    )
  })
  .add('Open and feature flag on, sending feedback success', () => {
    const { store } = configureStore(featureFlagOnSent)

    return (
      <Provider store={store}>
        <h1 className="mt-10 mb-10 has-text-centered is-uppercase">
          Feature feedback modal
        </h1>

        <div className="full-min-height pl-10 pr-10">
          <FeatureFeedbackModal
            featureFlagName="ct-checks"
            open={true}
            placeholder="This is the placeholder"
            title="This is the title"
          />
        </div>
      </Provider>
    )
  })
