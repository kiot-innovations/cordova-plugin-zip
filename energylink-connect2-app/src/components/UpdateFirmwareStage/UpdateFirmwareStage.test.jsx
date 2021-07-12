import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import React from 'react'

import UpdateFirmwareStage from '.'

let wrapper

describe('UpdateFirmwareStage', () => {
  describe('stage in progress', () => {
    beforeEach(() => {
      wrapper = shallow(
        <UpdateFirmwareStage
          stage="Downloading firmware"
          percent={10}
        ></UpdateFirmwareStage>
      )
    })

    it('renders percentage', () => expect(toJson(wrapper)).toMatchSnapshot())
  })

  describe('stage not started', () => {
    beforeEach(() => {
      wrapper = shallow(
        <UpdateFirmwareStage
          stage="Downloading firmware"
          percent={0}
        ></UpdateFirmwareStage>
      )
    })

    it('renders percentage', () => expect(toJson(wrapper)).toMatchSnapshot())
  })

  describe('stage finished', () => {
    beforeEach(() => {
      wrapper = shallow(
        <UpdateFirmwareStage
          stage="Downloading firmware"
          percent={100}
        ></UpdateFirmwareStage>
      )
    })

    it('renders percentage', () => expect(toJson(wrapper)).toMatchSnapshot())
  })
})
