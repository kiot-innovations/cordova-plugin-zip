import React from 'react'
import * as ReactDOM from 'react-dom'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import Firmwares, { getFileName, getFileSize } from '.'

describe('Firmwares component', () => {
  beforeAll(() => {
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element
    })
  })

  afterEach(() => {
    ReactDOM.createPortal.mockClear()
  })
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
        progress: { progress: 0, lastProgress: 0, downloading: false },
        gridProfileProgress: {
          progress: 0,
          lastProgress: 0,
          lastModified: null
        },
        fileInfo: { name: 'test-file.zip', error: '' }
      }
    })
    expect(component.html()).toMatchSnapshot()
  })
  it('should type-safe the file name', () => {
    const name = 'file name'
    let fileInfoObj = { name }
    expect(getFileName(fileInfoObj)).toBe(name)
    fileInfoObj = {}
    expect(getFileName(fileInfoObj)).toBe(undefined)
  })
  it('should type-safe the file name', () => {
    const size = 20
    let fileInfoObj = { size }
    expect(getFileSize(fileInfoObj)).toBe(size)
    fileInfoObj = {}
    expect(getFileSize(fileInfoObj)).toBe(undefined)
  })
})
