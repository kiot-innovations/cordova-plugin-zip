import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import useAppUpdate from 'hooks/useAppUpdate'
import useUpgrade from 'hooks/useUpgrade'
import { updateBodyHeight } from 'shared/utils'

function HooksInitializer() {
  const dispatch = useDispatch()

  useAppUpdate()
  useUpgrade()

  useEffect(() => {
    window.addEventListener('keyboardDidHide', updateBodyHeight)
  }, [dispatch])
  return null
}

export default HooksInitializer
