import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import useAppUpdate from 'hooks/useAppUpdate'
import useUpgrade from 'hooks/useUpgrade'
import { updateBodyHeight } from 'shared/utils'
import { validateSession } from 'state/actions/auth'
import { deviceResumeListener } from 'state/actions/mobile'

function HooksInitializer() {
  const dispatch = useDispatch()

  useAppUpdate()
  useUpgrade()

  useEffect(() => {
    dispatch(deviceResumeListener())
    dispatch(validateSession())
    window.addEventListener('keyboardDidHide', updateBodyHeight)
  }, [dispatch])
  return null
}

export default HooksInitializer
