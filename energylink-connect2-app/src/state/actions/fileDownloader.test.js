import { abortDownload, getLuaName } from './fileDownloader'

it('should abort the download', () => {
  const dispatch = jest.fn()
  const abort = jest.fn()
  window.downloader = { abort }
  abortDownload()(dispatch)
  expect(dispatch).toBeCalledTimes(1)
  expect(abort).toBeCalledTimes(1)
})

describe('The getLuaFile', () => {
  it('should parse the name correctly', () => {
    const expectedOutput = 'staging prod adama'
    const input =
      'https://fw-assets-pvs6-dev.dev-edp.sunpower.com/staging-prod-adama/4/fwup/rootfs.tgz'
    expect(getLuaName(input)).toBe(expectedOutput)
  })
})
