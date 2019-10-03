import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProgressBar from '../../components/ProgressBar'
import { performLogin, createAccount } from '../../state/actions/auth'
import { Redirect } from 'react-router-dom'
import paths from '../Router/paths'
import { useI18n } from '../../shared/i18n'
import { IconOff, IconOn } from './Icons'
import './SignupLoader.scss'

function SignupLoader({ location = {}, isLoggedIn = false }) {
  const t = useI18n()
  const dispatch = useDispatch()
  const signUpState = location.state && location.state.signUpState
  const isSignupValid = !!(
    !isLoggedIn &&
    signUpState &&
    signUpState.serial &&
    signUpState.password &&
    signUpState.addressId
  )

  const isAccountCreated = useSelector(
    state => !!(state.global && state.global.isAccountCreated)
  )

  useEffect(() => {
    if (isSignupValid && !isAccountCreated) {
      dispatch(createAccount(signUpState))
    }
  }, [dispatch, isAccountCreated, isSignupValid, signUpState])

  if (!isSignupValid) {
    return <Redirect to={paths.ROOT} />
  }

  const Icon = isAccountCreated ? IconOn : IconOff
  const progressValue = isAccountCreated ? 100 : null
  const text = isAccountCreated ? t('ACCOUNT_CREATED') : t('CREATING_ACCOUNT')

  if (isAccountCreated) {
    dispatch(
      performLogin({
        username: signUpState.email,
        password: signUpState.password
      })
    )
  }

  return (
    <section className="signup-loader section full-min-height is-flex">
      <div className="container columns full-min-height is-flex ">
        <div className="column is-hidden-mobile"></div>
        <div className="column has-text-centered">
          <div className="container mb-40">
            <Icon height="35" />
          </div>
          <div className="progress-bar-container container mb-25">
            <ProgressBar value={progressValue} />
          </div>
          <div className="container">
            <span>{text}</span>
          </div>
        </div>
        <div className="column is-hidden-mobile"></div>
      </div>
    </section>
  )
}

export default SignupLoader
