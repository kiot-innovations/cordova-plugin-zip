import React from 'react'
import { shallow } from 'enzyme'
import TextField from '.'

describe('TextField component', () => {
  let input

  beforeEach(() => {
    input = {
      ...input,
      onChange: jest.fn(),
      onBlur: jest.fn()
    }
  })

  it('renders and matches a snapshot', () => {
    const component = shallow(<TextField input={input} meta={{}} />)
    expect(component).toMatchSnapshot()
  })

  it('renders and matches a snapshot when there is an error', () => {
    const component = shallow(
      <TextField
        input={input}
        meta={{ touched: true, error: 'something wrong happened' }}
        autoComplete="username"
        type="textarea"
        disabled={true}
        placeholder="some placeholder"
      />
    )
    expect(component).toMatchSnapshot()
  })

  it('calls onChange callback', () => {
    const component = shallow(
      <TextField
        input={input}
        meta={{ touched: true, error: 'something wrong happened' }}
      />
    )

    component.find('input').simulate('change', 'some type')

    expect(input.onChange).toHaveBeenCalled()
  })

  it('calls onBlur callback', () => {
    const component = shallow(
      <TextField
        input={input}
        meta={{ touched: true, error: 'something wrong happened' }}
      />
    )
    component.find('input').simulate('blur', 'some type')
    expect(input.onBlur).toHaveBeenCalled()
  })
})
