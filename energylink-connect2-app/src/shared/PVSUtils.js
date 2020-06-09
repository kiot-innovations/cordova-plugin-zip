import { compose, join, slice, split } from 'ramda'
import { getApiPVS } from 'shared/api'
import { flipConcat } from 'shared/utils'

export const sendCommandToPVS = async command => {
  const baseUrl = process.env.REACT_APP_PVS_SELECTEDADDRESS
  const response = await fetch(`${baseUrl}/dl_cgi?Command=${command}`)
  return await response.json()
}

export async function isThePVSAdama() {
  try {
    await getApiPVS()
    return false
  } catch (e) {
    return true
  }
}

export const getFileSystemFromLuaFile = compose(
  flipConcat('/fwup_lua_usb.zip'),
  join('/'),
  slice(0, -2),
  split('/')
)
