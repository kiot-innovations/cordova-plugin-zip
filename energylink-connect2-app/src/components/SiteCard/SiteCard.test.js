import { shallow } from 'enzyme'
import { clone } from 'ramda'
import React from 'react'

import * as i18n from '../../shared/i18n'
import { getSitePayload, getSiteState } from '../../shared/siteHelpers'

import { siteCardMock } from './SiteCard.stories'

import SiteCard from '.'

describe('SiteCard component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing - Site Commissioned', () => {
    const component = shallow(
      <SiteCard
        site={getSitePayload(siteCardMock)}
        state={getSiteState(siteCardMock)}
      />
    )
    expect(component).toMatchSnapshot()
  })

  it('renders without crashing - Site Commissioned without Storage', () => {
    const siteWSC = clone(siteCardMock)
    siteWSC.strg_sys_sz_kwh = null
    const component = shallow(
      <SiteCard site={getSitePayload(siteWSC)} state={getSiteState(siteWSC)} />
    )
    expect(component).toMatchSnapshot()
  })

  it('renders without crashing - Site Not Commissioned Needs Storage', () => {
    const siteWSC = clone(siteCardMock)
    siteWSC.pvs_type = 'Aggregate'
    siteWSC.pvs_count = 0
    siteWSC.strg_sys_sz_kwh = 1000
    const component = shallow(
      <SiteCard site={getSitePayload(siteWSC)} state={getSiteState(siteWSC)} />
    )
    expect(component).toMatchSnapshot()
  })

  it('renders without crashing - Site Not Commissioned Dont Expect Storage', () => {
    const siteWOSC = clone(siteCardMock)
    siteWOSC.pvs_count = 0
    siteWOSC.strg_sys_sz_kwh = 0
    const component = shallow(
      <SiteCard
        site={getSitePayload(siteWOSC)}
        state={getSiteState(siteWOSC)}
      />
    )
    expect(component).toMatchSnapshot()
  })
})
