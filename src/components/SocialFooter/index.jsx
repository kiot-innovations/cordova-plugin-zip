import React from 'react'
import clsx from 'clsx'
import { useI18n } from '../../shared/i18n'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon
} from './icons'

import './SocialFooter.scss'

function SocialFooter({ invert = false }) {
  const {
    REACT_APP_FACEBOOK_URL,
    REACT_APP_TWITTER_URL,
    REACT_APP_LINKEDIN_URL,
    REACT_APP_YOUTUBE_URL,
    REACT_APP_INSTAGRAM_URL
  } = process.env
  const t = useI18n()
  const defaultTheme = invert ? 'white-text' : 'dark-text'
  const classNames = clsx(defaultTheme, 'pb-20')

  return (
    <div className="sp-social-share is-flex">
      <h3 className={classNames}>{t('SOCIAL_FOOTER_TITLE')}</h3>
      <div className="share-icons is-flex">
        <a
          target="_blank"
          href={REACT_APP_FACEBOOK_URL}
          rel="noopener noreferrer"
        >
          <FacebookIcon />
        </a>
        <a
          target="_blank"
          href={REACT_APP_TWITTER_URL}
          rel="noopener noreferrer"
          className="pt-5"
        >
          <TwitterIcon />
        </a>
        <a
          target="_blank"
          href={REACT_APP_LINKEDIN_URL}
          rel="noopener noreferrer"
        >
          <LinkedinIcon />
        </a>
        <a
          target="_blank"
          href={REACT_APP_YOUTUBE_URL}
          rel="noopener noreferrer"
          className="pt-5"
        >
          <YoutubeIcon />
        </a>
        <a
          target="_blank"
          href={REACT_APP_INSTAGRAM_URL}
          rel="noopener noreferrer"
          className="pt-3"
        >
          <InstagramIcon />
        </a>
      </div>
    </div>
  )
}

export default SocialFooter
