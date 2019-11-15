import React from 'react'
import { useSelector } from 'react-redux'
import { animated, useTransition } from 'react-spring'
import Nav from '@sunpower/nav'
import './footer.scss'

const Footer = () => {
  const showFooter = useSelector(({ ui }) => ui.footer)
  const grow = useTransition(!!showFooter, null, {
    from: { maxHeight: 0, opacity: 0 },
    enter: { maxHeight: 90, opacity: 1 },
    leave: { maxHeight: 0, opacity: 0 }
  })

  const navBarItems = [
    {
      icon: 'sp-home',
      text: 'Home',
      onClick: () => {}
    },
    {
      icon: 'sp-list',
      text: 'List',
      onClick: () => {}
    },
    {
      icon: 'sp-signal',
      text: 'Commission',
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
