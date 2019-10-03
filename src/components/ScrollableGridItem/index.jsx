import React from 'react'
import clsx from 'clsx'
import './ScrollableGridItem.scss'

function ScrollableGridItem({
  text,
  rightIcon = null,
  leftIcon = null,
  onClick = () => {},
  paddingLeft = 'pl-30',
  paddingRight = 'pr-30'
}) {
  const classes = clsx(
    'scrollable-grid-item',
    paddingLeft,
    paddingRight,
    'is-flex'
  )
  return (
    <div className={classes} onClick={onClick}>
      {leftIcon && <span className="item-icon pr-10 is-flex">{leftIcon}</span>}
      <span className="item-text is-flex">{text}</span>
      {rightIcon && <span className="item-icon is-flex">{rightIcon}</span>}
    </div>
  )
}

export default ScrollableGridItem
