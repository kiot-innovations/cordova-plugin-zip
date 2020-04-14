import clsx from 'clsx'
import { Loader } from 'components/Loader'
import useGlobalModal, { useGlobalHideModal } from 'hooks/useGlobalModal'
import React, { lazy, Suspense } from 'react'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import './ModalWrapper.scss'

export const ModalWrapper = () => {
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
              {title}
            </div>
          )}
        </div>
        <div className="modal-body">
          <Suspense fallback={<Loader />}>
            {either(
              componentPath,
              <CustomComponent {...componentProps} />,
              body
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
              Close
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
