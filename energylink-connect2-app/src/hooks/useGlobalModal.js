import { compose, pick, prop } from 'ramda'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HIDE_MODAL, SHOW_MODAL } from 'state/actions/modal'

const getModalData = compose(
  pick([
    'title',
    'componentPath',
    'componentProps',
    'body',
    'withButtons',
    'okButton',
    'dismissable',
    'show'
  ]),
  prop('modal')
)
const useGlobalModal = () => useSelector(getModalData)

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
