/* eslint no-undef: 0 */
import React from 'react'
import * as i18n from 'shared/i18n'
import { ModalWrapper } from './Wrapper'

describe('The wrapper component for global modals', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })
  it('should show if the component if the redux store tells modal', () => {
    const { component } = mountWithProvider(<ModalWrapper />)({
      modal: { show: true }
    })
    component.update()
    const wrapper = component.find('.is-active')
    expect(wrapper.length).toBe(1)
    expect(component).toMatchSnapshot()
  })
  it('should NOT show if the component if the redux store tells modal', () => {
    const { component } = mountWithProvider(<ModalWrapper />)({
      modal: {}
    })
    component.update()
    const wrapper = component.find('.is-active')
    expect(component).toMatchSnapshot()
    expect(wrapper.length).toBe(0)
  })
  it('should show a title if the property is passed', () => {
    const title = 'My super modal'
    const { component } = mountWithProvider(<ModalWrapper />)({
      modal: { show: true, title }
    })
    const wrapper = component.find('.modal-title')
    expect(wrapper).toHaveLength(1)
    expect(wrapper.html()).toContain(title)
  })
  it('should show a body if the property is passed', () => {
    const body = 'My super body modal :)'
    const { component } = mountWithProvider(<ModalWrapper />)({
      modal: { show: true, body }
    })
    const wrapper = component.find('.modal-body')
    expect(wrapper).toHaveLength(1)
    expect(wrapper.html()).toContain(body)
  })
})
