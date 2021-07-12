import { shallow } from 'enzyme'
import React from 'react'

import FileCollapsible from './index'

import * as i18n from 'shared/i18n'

describe('File Collapsible component', () => {
  beforeEach(function() {
    jest.spyOn(i18n, 'useI18n').mockImplementation(() => (key, ...params) => {
      return `${key.toUpperCase()} ${params.join('_')}`.trim()
    })
  })
  test('renders correctly with no props', () => {
    const component = shallow(<FileCollapsible />)
    expect(component).toMatchSnapshot()
  })
  test('renders correctly while downloading', () => {
    const component = shallow(
      <FileCollapsible
        progress={80}
        fileName="test fileName"
        size={40.0}
        isDownloading
        step="DOWNLOADING"
      />
    )
    expect(component).toMatchSnapshot()
  })
  test('renders correctly complete', () => {
    const component = shallow(
      <FileCollapsible
        progress={100}
        fileName="test fileName"
        size={40.0}
        isDownloaded
        step="COMPLETE"
      />
    )
    expect(component).toMatchSnapshot()
  })
})
