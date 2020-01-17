import React from 'react'
import { shallow } from 'enzyme'
import SocialShareButton from '.'
import * as reactRedux from 'react-redux'
import * as i18n from '../../shared/i18n'

describe('SocialShareButton component', () => {
  let dispatchMock
  let selectorSpy
  beforeEach(() => {
    dispatchMock = jest.fn()
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    selectorSpy = jest.spyOn(reactRedux, 'useSelector')
  })

  it('renders without crashing', () => {
    selectorSpy.mockImplementation(() => ({ dataUrl: '', isConverting: false }))
    const component = shallow(<SocialShareButton />)
    expect(component).toMatchSnapshot()
  })

  it('should execute pre share function', () => {
    selectorSpy.mockImplementation(() => ({ dataUrl: '', isConverting: false }))
    const preShareFn = jest.fn()
    const component = shallow(<SocialShareButton beforeShare={preShareFn} />)
    component.find('.share-icon').simulate('click')
    expect(preShareFn).toBeCalled()
  })

  it('should trigger open web modal', () => {
    const preShareFn = jest.fn()
    selectorSpy.mockImplementation(() => ({
      dataUrl: 'some-base64-image',
      isConverting: false
    }))
    process.env = {
      REACT_APP_IS_MOBILE: false
    }
    const { component } = mountWithProvider(
      <SocialShareButton beforeShare={preShareFn} />
    )({})
    component.find('svg.share-icon').simulate('click')
    expect(dispatchMock).toBeCalled()
  })
  // TODO: Enable this test after SPI
  it('should trigger open phonegap plugin modal', () => {
    global.plugins = {
      socialsharing: { share: jest.fn() }
    }
    const preShareFn = jest.fn()
    selectorSpy.mockImplementation(() => ({
      dataUrl: 'some-base64-image',
      isConverting: false
    }))
    process.env = {
      REACT_APP_IS_MOBILE: true
    }
    const { component } = mountWithProvider(
      <SocialShareButton beforeShare={preShareFn} />
    )({})
    component.find('svg.share-icon').simulate('click')
    expect(dispatchMock).not.toBeCalled()
    expect(global.plugins.socialsharing.share).toBeCalled()
  })

  it('should not trigger open web modal if no image', () => {
    const preShareFn = jest.fn()
    selectorSpy.mockImplementation(() => ({ dataUrl: '', isConverting: false }))
    process.env = {
      REACT_APP_IS_MOBILE: false
    }
    const { component } = mountWithProvider(
      <SocialShareButton beforeShare={preShareFn} />
    )({})
    component.find('svg.share-icon').simulate('click')
    expect(dispatchMock).not.toBeCalled()
  })

  it('should not trigger open phonegap plugin modal if no image', () => {
    global.plugins = {
      socialsharing: { share: jest.fn() }
    }
    const preShareFn = jest.fn()
    selectorSpy.mockImplementation(() => ({ dataUrl: '', isConverting: false }))
    process.env = {
      REACT_APP_IS_MOBILE: true
    }
    const { component } = mountWithProvider(
      <SocialShareButton beforeShare={preShareFn} />
    )({})
    component.find('svg.share-icon').simulate('click')
    expect(dispatchMock).not.toBeCalled()
    expect(global.plugins.socialsharing.share).not.toBeCalled()
  })

  it('should not trigger open web modal if converting image', () => {
    const preShareFn = jest.fn()
    selectorSpy.mockImplementation(() => ({ dataUrl: '', isConverting: true }))
    process.env = {
      REACT_APP_IS_MOBILE: false
    }
    const { component } = mountWithProvider(
      <SocialShareButton beforeShare={preShareFn} />
    )({})
    component.find('svg.share-icon').simulate('click')
    // expect(preShareFn).toBeCalled()
    expect(dispatchMock).not.toBeCalled()
  })

  it('should not trigger open phonegap plugin modal if converting image', () => {
    global.plugins = {
      socialsharing: { share: jest.fn() }
    }
    const preShareFn = jest.fn()
    selectorSpy.mockImplementation(() => ({ dataUrl: '', isConverting: true }))
    process.env = {
      REACT_APP_IS_MOBILE: true
    }
    const { component } = mountWithProvider(
      <SocialShareButton beforeShare={preShareFn} />
    )({})
    component.find('svg.share-icon').simulate('click')
    expect(dispatchMock).not.toBeCalled()
    expect(global.plugins.socialsharing.share).not.toBeCalled()
  })
})
