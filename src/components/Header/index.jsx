import React from 'react'
import Logo from '@sunpower/sunpowerimage'
import isNil from 'ramda/src/isNil'
import { trimString } from 'shared/trim'
import { either } from 'shared/utils'
import './Header.scss'

const getCount = window => (window.innerWidth > 375 ? 35 : 30)

function Header({ text, onClick }) {
  return (
    <header className="header is-flex level">
      <span className="sp sp-menu" onClick={onClick} role="button" />
      {either(
        isNil(text),
        <Logo />,
        <span className="text has-text-white" title={text}>
          {trimString(text, getCount(window))}
        </span>
      )}
    </header>
  )
}

export default Header
