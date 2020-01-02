import React from 'react'
import { useSelector } from 'react-redux'
import { animated, useTransition } from 'react-spring'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import Nav from '@sunpower/nav'
import './footer.scss'

const Footer = () => {
  const history = useHistory()
  const showFooter = useSelector(({ ui }) => ui.footer)
  const grow = useTransition(!!showFooter, null, {
    from: { maxHeight: 0, opacity: 0 },
    enter: { maxHeight: 90, opacity: 1 },
    leave: { maxHeight: 0, opacity: 0 }
  })

  function redirect(path) {
    history.push(path)
  }

  const navBarItems = [
    {
      icon: 'sp-home',
      text: 'Home',
      onClick: () => redirect(paths.PROTECTED.BILL_OF_MATERIALS.path),
      active:
        history.location.pathname === paths.PROTECTED.BILL_OF_MATERIALS.path
    },
    {
      icon: 'sp-list',
      text: 'Install',
      onClick: () => redirect(paths.PROTECTED.CONNECT_TO_PVS.path)
    },
    {
      icon: 'sp-signal',
      text: 'Configure',
      onClick: () => {}
    },
    {
      icon: 'sp-data',
      text: 'Data',
      onClick: () => {}
    }
  ]

  return grow.map(
    ({ item, props, key }) =>
      item && (
        <animated.footer
          style={props}
          key={key}
          className={'custom-footer is-clipper'}
        >
          <Nav items={navBarItems} />
        </animated.footer>
      )
  )
}

export default Footer
