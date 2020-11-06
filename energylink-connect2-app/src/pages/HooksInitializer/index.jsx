import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useAppUpdate from 'hooks/useAppUpdate'
import useCanceledPVSConnection from 'hooks/useCanceledPVSConnection'
import useUpgrade from 'hooks/useUpgrade'
import { deviceResumeListener } from 'state/actions/mobile'
import { validateSession } from 'state/actions/auth'
import { updateBodyHeight } from 'shared/utils'

function HooksInitializer() {
  const dispatch = useDispatch()

  useAppUpdate()
  useUpgrade()
  useCanceledPVSConnection()

  useEffect(() => {
    dispatch(deviceResumeListener())
    dispatch(validateSession())
    window.addEventListener('keyboardDidHide', updateBodyHeight)
  }, [dispatch])
  return null
}

export default HooksInitializer
