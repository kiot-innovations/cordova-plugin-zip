import React, { Fragment, useEffect, useState } from 'react'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import {
  ShareIcon,
  EmailIcon,
  FacebookIcon,
  TextIcon,
  TwitterIcon
} from './Icons'
import OverlayModalLayout from '../OverlayModalLayout'
import { useI18n } from '../../shared/i18n'
import { TOGGLE_MODAL } from '../../state/actions/modal'

import './SocialShareButton.scss'

function openModal(dispatch, dataUrl) {
  const isMobile = process.env.REACT_APP_IS_MOBILE
  if (!isMobile) {
    dispatch(TOGGLE_MODAL({ isActive: true }))
  } else {
    window.plugins.socialsharing.share(
      '',
      '',
      dataUrl,
      'http://us.sunpower.com'
    )
  }
}

function onClick(beforeShare, setIsClicked) {
  return async () => {
    beforeShare()
    setIsClicked(true)
  }
}

function SocialShareButton({ beforeShare = () => {} }) {
  const dispatch = useDispatch()
  const t = useI18n()
  const { dataUrl, isConverting } = useSelector(state => state.share)
  const [isClicked, setIsClicked] = useState(false)

  useEffect(() => {
    if (!isConverting && dataUrl && isClicked) {
      setIsClicked(false)
      openModal(dispatch, dataUrl)
    }
  }, [dispatch, dataUrl, isConverting, isClicked, setIsClicked])
  const classes = clsx('share-icon', { loader: isConverting && isClicked })
  return (
    <Fragment>
      <ShareIcon
        className={classes}
        onClick={onClick(beforeShare, setIsClicked)}
      />
      <OverlayModalLayout header={t('SHARE_THIS_SECTION')}>
        <div className="share-container">
          <div className="share-item is-flex">
            <EmailIcon />
            <h3>Email</h3>
          </div>
          <div className="share-item is-flex">
            <TextIcon />
            <h3>Text</h3>
          </div>
          <div className="share-item is-flex">
            <FacebookIcon />
            <h3>Facebook</h3>
          </div>
          <div className="share-item is-flex">
            <TwitterIcon />
            <h3>Twitter</h3>
          </div>
        </div>
      </OverlayModalLayout>
    </Fragment>
  )
}

export default SocialShareButton
