import React from 'react'
import { shallow } from 'enzyme'
import ColoredBanner, { bannerCategories } from '.'

describe('Banner component', () => {
  test('Renders correctly', () => {
    const component = shallow(<ColoredBanner />)
    expect(component).toMatchSnapshot()
  })

  test('Renders all passed props', () => {
    const bannerText = 'Test banner text'
    const bannerActionText = 'Test banner action'
    const bannerAction = jest.fn()
    const customClass = 'lookForThisClass'

    const component = shallow(
      <ColoredBanner
        category={bannerCategories.ERROR}
        actionText={bannerActionText}
        action={bannerAction}
        text={bannerText}
        className={customClass}
      />
    )

    expect(component.find('.banner-error').length).toBe(1)
    expect(component.find('.sp-close').length).toBe(1)
    expect(component.find('.icon-error').length).toBe(1)
    expect(component.find('.banner-content-text').text()).toEqual(bannerText)
    expect(component.find('.banner-action').text()).toEqual(bannerActionText)

    component.find('.banner-action').simulate('click')
    expect(bannerAction).toBeCalled()
  })
  test('Applies proper classes for info category', () => {
    const component = shallow(
      <ColoredBanner category={bannerCategories.INFO} />
    )
    expect(component.find('.banner-info').length).toBe(1)
    expect(component.find('.sp-info').length).toBe(1)
    expect(component.find('.icon-info').length).toBe(1)
  })

  test('Applies proper classes for warning category', () => {
    const component = shallow(
      <ColoredBanner category={bannerCategories.WARNING} />
    )
    expect(component.find('.banner-warning').length).toBe(1)
    expect(component.find('.sp-hey').length).toBe(1)
    expect(component.find('.icon-warning').length).toBe(1)
  })

  test('Applies proper classes for success category', () => {
    const component = shallow(
      <ColoredBanner category={bannerCategories.SUCCESS} />
    )
    expect(component.find('.banner-success').length).toBe(1)
    expect(component.find('.sp-check').length).toBe(1)
    expect(component.find('.icon-success').length).toBe(1)
  })

  test('Applies proper classes for error category', () => {
    const component = shallow(
      <ColoredBanner category={bannerCategories.ERROR} />
    )
    expect(component.find('.banner-error').length).toBe(1)
    expect(component.find('.sp-close').length).toBe(1)
    expect(component.find('.icon-error').length).toBe(1)
  })
})
