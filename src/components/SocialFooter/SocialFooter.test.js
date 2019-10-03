import React from 'react'
import { shallow } from 'enzyme'
import SocialFooter from '.'
import * as i18n from '../../shared/i18n'

beforeEach(() => {
  process.env = {
    REACT_APP_EDP_API_URL: 'https://dev-elhapi.dev-edp.sunpower.com/v1/elh',
    REACT_APP_FACEBOOK_URL: 'https://www.facebook.com/sunpower',
    REACT_APP_TWITTER_URL: 'https://twitter.com/SunPower',
    REACT_APP_LINKEDIN_URL:
      'https://www.linkedin.com/company/sunpower-corporation',
    REACT_APP_YOUTUBE_URL: 'https://www.youtube.com/user/sunpower',
    REACT_APP_INSTAGRAM_URL: 'https://www.instagram.com/sunpower'
  }
})

describe('Social component', () => {
  it('renders without crashing', () => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    const component = shallow(<SocialFooter />)
    expect(component).toMatchSnapshot()
  })
})
