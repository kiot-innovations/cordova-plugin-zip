import useAppUpdate from 'hooks/useAppUpdate'
import useCanceledPVSConnection from 'hooks/useCanceledPVSConnection'
import useUpgrade from 'hooks/useUpgrade'

export default () => {
  useAppUpdate()
  useUpgrade()
  useCanceledPVSConnection()

  return null
}
