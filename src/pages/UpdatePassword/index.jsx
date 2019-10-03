import React from 'react'
import clsx from 'clsx'
import { useDispatch } from 'react-redux'
import { useForm, useField } from 'react-final-form-hooks'
import ModalLayout from '../../components/ModalLayout'
import ModalItem from '../../components/ModalItem'
import PasswordToggle from '../../components/PasswordToggle'
import { updateUser } from '../../state/actions/user'
import { useI18n } from '../../shared/i18n'
import { trimObject } from '../../shared/trim'
import { PASSWORD_REGEXP } from '../../shared/regex'
import './UpdatePassword.scss'

function onSubmit(dispatch) {
  return values => {
    const payload = {
      currentpassword: values.currentPassword,
      password: values.newPassword
    }
    return dispatch(updateUser(trimObject(payload), null, true))
  }
}

function validate(values, t) {
  const errors = {}

  if (!values.currentPassword) {
    errors.currentPassword = t('REQ_PASSWORD')
  }
  if (!values.newPassword) {
    errors.newPassword = t('REQ_PASSWORD')
  }
  if (!values.retypePassword) {
    errors.retypePassword = t('REQ_PASSWORD')
  }
  if (values.currentPassword && !PASSWORD_REGEXP.test(values.currentPassword)) {
    errors.currentPassword = t('INVALID_PASSWORD')
  }
  if (values.newPassword && !PASSWORD_REGEXP.test(values.newPassword)) {
    errors.newPassword = t('INVALID_PASSWORD')
  }
  if (values.newPassword !== values.retypePassword) {
    errors.retypePassword = t('INVALID_PASSWORD_MATCH')
  }
  return errors
}

function UpdatePassword({ history, location, className }) {
  const t = useI18n()
  const dispatch = useDispatch()
  const classes = clsx('update-password-modal', className)
  const { form, handleSubmit, submitting } = useForm({
    onSubmit: onSubmit(dispatch),
    validate: values => validate(values, t)
  })

  const currentPassword = useField('currentPassword', form)
  const newPassword = useField('newPassword', form)
  const retypePassword = useField('retypePassword', form)

  const submitClassnames = clsx('button', 'is-uppercase', 'is-primary', {
    'is-loading': submitting
  })

  return (
    <ModalLayout
      className={classes}
      history={history}
      title={t('UPDATE_PASSWORD')}
      from={location && location.state && location.state.from}
      hasBackButton
    >
      <ModalItem
        overtitleAlign="left"
        overtitle={t('UPDATE_PASSWORD_DESCRIPTION')}
      >
        <form className="control" onSubmit={handleSubmit}>
          <PasswordToggle
            input={currentPassword.input}
            meta={currentPassword.meta}
            placeholder={t('PASSWORD_CURRENT')}
            className="input-light"
            autoComplete="current-password"
          />
          <h1 className="title is-7 is-uppercase has-text-centered new-password">
            {t('ENTER_NEW_PASSWORD')}
          </h1>
          <PasswordToggle
            input={newPassword.input}
            meta={newPassword.meta}
            placeholder={t('PASSWORD_NEW')}
            className="input-light"
          />
          <PasswordToggle
            input={retypePassword.input}
            meta={retypePassword.meta}
            placeholder={t('PASSWORD_NEW_1')}
            className="input-light"
          />
          <div className="password-rules mt-10">
            <span>{t('PASSWORD_REQ')}</span>
            <ul>
              <li>{t('PASSWORD_REQ_ONE_LOWER')}</li>
              <li>{t('PASSWORD_REQ_EIGHT_OR_MORE')}</li>
              <li>{t('PASSWORD_REQ_AT_LEAST_TWO_LETTERS')}</li>
              <li>{t('PASSWORD_REQ_AT_LEAST_ONE_NUMBER')}</li>
            </ul>
          </div>
          <div className="column mt-30">
            <div className="field is-grouped is-grouped-centered">
              <p className="control">
                <button
                  className={submitClassnames}
                  type="submit"
                  disabled={submitting}
                >
                  {t('BTN_UPDATE')}
                </button>
              </p>
            </div>
          </div>
        </form>
      </ModalItem>
    </ModalLayout>
  )
}

export default UpdatePassword
