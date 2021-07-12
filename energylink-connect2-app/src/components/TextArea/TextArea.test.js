import { shallow } from 'enzyme'
import React from 'react'

import TextArea from '.'

describe('TextArea component', () => {
  let input

  beforeEach(() => {
    input = {
      ...input,
      onChange: jest.fn(),
      onBlur: jest.fn()
    }
  })

  it('renders and matches a snapshot', () => {
    const component = shallow(<TextArea input={input} meta={{}} />)
    expect(component).toMatchSnapshot()
  })

  it('renders and matches a snapshot when there is an error', () => {
    const component = shallow(
      <TextArea
        input={input}
        meta={{ touched: true, error: 'something wrong happened' }}
        autoComplete="username"
        disabled={true}
        placeholder="some placeholder"
      />
    )
    expect(component).toMatchSnapshot()
  })

  it('calls onChange callback', () => {
    const component = shallow(
      <TextArea
        input={input}
        meta={{ touched: true, error: 'something wrong happened' }}
      />
    )

    component.find('textarea').simulate('change', 'some type')

    expect(input.onChange).toHaveBeenCalled()
  })

  it('calls onBlur callback', () => {
    const component = shallow(
      <TextArea
        input={input}
        meta={{ touched: true, error: 'something wrong happened' }}
      />
    )
    component.find('textarea').simulate('blur', 'some type')
    expect(input.onBlur).toHaveBeenCalled()
  })
})
