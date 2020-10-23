import React, { lazy, Suspense } from 'react'
import clsx from 'clsx'

import useGlobalModal, { useGlobalHideModal } from 'hooks/useGlobalModal'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'

import './ModalWrapper.scss'

const ModalWrapper = () => {
  const {
    title,
    componentPath,
    componentProps,
    body,
    withButtons,
    dismissable,
    show,
    okButton
  } = useGlobalModal()

  const t = useI18n()
  const closeModal = useGlobalHideModal()
  const CustomComponent = lazy(() => import(`${componentPath}`))

  return (
    <div className={clsx('modal modal-wrapper', { 'is-active': show })}>
      <div className="modal-background" />
      <div className="modal-content">
        {either(
          dismissable,
          <button
            onClick={closeModal}
            className="modal-close is-medium"
            aria-label="close"
          />
        )}
        <div className="modal-bar">
          {either(
            title,
            <div className="modal-title mb-15 has-text-white has-text-weight-bold">
              {t(title)}
            </div>
          )}
        </div>
        <div className="modal-body">
          <Suspense fallback={null}>
            {either(
              componentPath,
              <CustomComponent {...componentProps} />,
              t(body)
            )}
          </Suspense>
        </div>
        {either(
          withButtons,
          <div className="buttons-container mt-10">
            <button
              className="button button-transparent has-text-primary is-uppercase has-text-weight-bold"
              onClick={closeModal}
            >
              {t('CLOSE')}
            </button>
            <button
              className="button is-primary is-uppercase"
              onClick={okButton}
            >
              {t('ACCEPT')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
export default ModalWrapper
