import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { SHOW_MODAL } from 'state/actions/modal'
import { APP_UPDATE_OPEN_MARKET } from 'state/actions/global'

function useAppUpdate() {
  const t = useI18n()
  const { updateAvailable, updateVersion } = useSelector(state => state.global)
  const dispatch = useDispatch()

  const onUpdate = useCallback(() => {
    dispatch(APP_UPDATE_OPEN_MARKET())
  }, [dispatch])

  useEffect(() => {
    if (updateAvailable) {
      dispatch(
        SHOW_MODAL({
          title: t('UPDATE_TITLE', updateVersion),
          componentPath: './AppUpdaterModal.jsx',
          componentProps: { onUpdate },
          dismissable: true
        })
      )
    }
  }, [dispatch, onUpdate, t, updateAvailable, updateVersion])
}

export default useAppUpdate
