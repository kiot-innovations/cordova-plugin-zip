import React from 'react'
import * as reactRedux from 'react-redux'
import Firmwares from '.'
import * as i18n from 'shared/i18n'

describe('Firmwares component', () => {
  let dispatchMock
  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<Firmwares />)({
      fileDownloader: {
        progress: { progress: 0, lastProgress: 0 },
        fileInfo: { name: 'test-file.zip', error: '' }
      }
    })
    expect(component.html()).toMatchSnapshot()
  })
})
