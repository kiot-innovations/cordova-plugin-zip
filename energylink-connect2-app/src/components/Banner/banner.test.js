import { shallow } from 'enzyme'
import React from 'react'
import Banner from './index'

describe('Ribbon should be', function() {
  it('hidden in Prod and Training flavors', function() {
    const component = shallow(<Banner flavor="cm2-prod" />)
    expect(component).toMatchSnapshot()
    const training = shallow(<Banner flavor="cm2-training" />)
    expect(training).toMatchSnapshot()
  })
  it('displayed in Test and UAT flavors', function() {
    const component = shallow(<Banner flavor="cm2-test" />)
    expect(component).toMatchSnapshot()
    const uat = shallow(<Banner flavor="cm2-uat" />)
    expect(uat).toMatchSnapshot()
  })
})
