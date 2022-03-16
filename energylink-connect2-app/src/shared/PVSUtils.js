import allSettled from 'promise.allsettled'
import { compose, find, join, propEq, slice, split } from 'ramda'

import { getApiPVS } from 'shared/api'
import { flipConcat } from 'shared/utils'

const parsePromises = compose(Boolean, find(propEq('status', 'fulfilled')))

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
  flipConcat('/fwup/rootfs.tgz'),
  join('/'),
  slice(0, -2),
  split('/')
)

export const getPVS5FsUrlFromLuaFile = compose(
  flipConcat('/rootfs.tgz'),
  join('/'),
  slice(0, -1),
  split('/')
)

export const getPVS5ScriptsUrlFromLuaFile = compose(
  flipConcat('/scripts.tgz'),
  join('/'),
  slice(0, -1),
  split('/')
)

export const getPVS5KernelUrlFromLuaFile = compose(
  flipConcat('/kernel.tgz'),
  join('/'),
  slice(0, -1),
  split('/')
)

export async function isConnectedToPVS() {
  const promises = [getApiPVS(), sendCommandToPVS('GetSupervisorInformation')]
  return parsePromises(await allSettled(promises))
}
