import { getApiPVS } from 'shared/api'

export const sendCommandToPVS = async command => {
  const baseUrl = process.env.REACT_APP_PVS_SELECTEDADDRESS
  const response = await fetch(`${baseUrl}/dl_cgi?Command=${command}`)
  return await response.json()
}

export async function isThePVSAdama() {
  try {
    const res = await sendCommandToPVS('GetSupervisorInformation')
    if (!res.ok) throw new Error('PVS NOT CONNECTED')
    await getApiPVS()
    return false
  } catch (e) {
    return true
  }
}
