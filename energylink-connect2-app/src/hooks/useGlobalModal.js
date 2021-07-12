import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { HIDE_MODAL, SHOW_MODAL } from 'state/actions/modal'

const useGlobalModal = () => useSelector(state => state.modal)

export const useShowModal = props => {
  const dispatch = useDispatch()
  return useCallback(
    (params = {}) => {
      dispatch(SHOW_MODAL({ ...props, ...params }))
    },
    [dispatch, props]
  )
}

export const useGlobalHideModal = () => {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(HIDE_MODAL())
  }, [dispatch])
}

export default useGlobalModal
