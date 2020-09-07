import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { SHOW_MODAL } from 'state/actions/modal'

function useAppUpdate() {
  const t = useI18n()
  const { updateAvailable, updateVersion } = useSelector(state => state.global)
  const dispatch = useDispatch()

  useEffect(() => {
    if (updateAvailable) {
      dispatch(
        SHOW_MODAL({
          title: t('UPDATE_TITLE', updateVersion),
          componentPath: './AppUpdaterModal.jsx',
          dismissable: true
        })
      )
    }
  }, [dispatch, t, updateAvailable, updateVersion])
}

export default useAppUpdate
