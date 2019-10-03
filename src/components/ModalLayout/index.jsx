import React from 'react'
import clsx from 'clsx'
import { CloseCross } from './Icons'
import BackButton from '../BackButton'
import paths from '../../pages/Router/paths'
import './ModalLayout.scss'

function goBack(history, state, from, hasBackButton) {
  return () =>
    hasBackButton || from
      ? history.push({
          pathname: from || paths.ROOT,
          state
        })
      : history.goBack()
}

function ModalLayout({
  className,
  history,
  title,
  children,
  onClose = () => {},
  from = null,
  imageHeader = null,
  hasBackButton
}) {
  const bodyClasses = clsx(
    'modal-section section has-bar full-min-height is-flex',
    className
  )
  const navClasses = clsx('modal-navbar', 'navbar', className)
  return (
    <React.Fragment>
      <nav
        className={navClasses}
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          {hasBackButton && (
            <div className="back-button-container navbar-item">
              <BackButton history={history} width="35" height="35" />
            </div>
          )}
          <div className="navbar-item">
            {title && <h1 className="title is-7 is-uppercase">{title}</h1>}
            {imageHeader}
          </div>
          <div
            className="close-button navbar-item"
            onClick={() => {
              onClose()
              goBack(
                history,
                { ...history.location.state },
                from,
                hasBackButton
              )()
            }}
          >
            <CloseCross width="35" height="35" />
          </div>
        </div>
      </nav>
      <section className={bodyClasses}>{children}</section>
    </React.Fragment>
  )
}

export default ModalLayout
