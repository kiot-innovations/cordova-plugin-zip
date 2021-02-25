import {
  ERROR_CODES,
  getFileNameFromURL,
  getLuaName,
  getBuildNumber,
  getFileExtension,
  getFS,
  getFirmwareVersionData,
  getFullPath
} from '../fileSystem'
const luaFileURL =
  'https://fw-assets-pvs6-dev.dev-edp.sunpower.com/staging-prod-cylon/8133/fwup/fwup.lua'
it('should not change the error codes', () => {
  expect(ERROR_CODES).toMatchSnapshot()
})

describe('The getFileNameFromURL', () => {
  it('should get the fileName from a url', () => {
    const url =
      'https://s3-us-west-2.amazonaws.com/2oduso0/gridprofiles/v2/gridprofiles.tar.gz'
    expect(getFileNameFromURL(url)).toBe('gridprofiles.tar.gz')
  })
})

describe('The getLuaName function', () => {
  it('should get the correct lua name', () => {
    expect(getLuaName('')).toBe('')
    expect(getLuaName(luaFileURL)).toBe('staging prod cylon')
  })
})

describe('getBuildNumber function', () => {
  it('Get the correct Build Number', () => {
    const buildNumber = getBuildNumber(luaFileURL)
    expect(buildNumber).toBe(8133)
  })
})

describe('getFS function', () => {
  it('should get the fileSystem name based on the url', () => {
    const url =
      'https://fw-assets-pvs6-dev.dev-edp.sunpower.com/staging-prod-cylon/8133'
    expect(getFS(url + '/fwup/fwup.lua')).toBe(url + '/fwup_lua_cm2.zip')
  })
})

describe('getFirmwareVersionData', () => {
  it('should have all the info based on the fileURL', () => {
    const versionData = getFirmwareVersionData(luaFileURL)
    expect(versionData).toMatchSnapshot()

    const {
      luaFileName,
      fileURL,
      version,
      pvsFileSystemName,
      luaDownloadName,
      ...rest
    } = versionData
    expect(rest).toStrictEqual({})

    expect(luaFileName).toBe('staging prod cylon')
    expect(fileURL).toBe(luaFileURL)
    expect(version).toBe(8133)
    expect(pvsFileSystemName).toBe('staging-prod-cylon-8133.fs')
    expect(luaDownloadName).toBe('staging-prod-cylon-8133.lua')
  })
})

describe('getFileExtention function', () => {
  it('should return the extension without the dot', () => {
    expect(getFileExtension('new-file.zip')).toBe('zip')
    expect(getFileExtension('new-file.mp4.gz')).toBe('gz')
  })
})

describe('getFullPath function', () => {
  it('should return the file path without the start slash', () => {
    expect(getFullPath('/firmware/staging-prod-cylon-6744.fs')).toBe(
      'firmware/staging-prod-cylon-6744.fs'
    )
  })
})
