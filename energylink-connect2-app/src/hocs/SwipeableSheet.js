import React from 'react'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'

const SwipeableSheet = ({ children, open, onChange = () => {}, ...props }) => {
  const swipeableViewsProps = {
    className: 'swipeable'
  }

  return (
    <SwipeableBottomSheet
      open={open}
      onChange={onChange}
      swipeableViewsProps={swipeableViewsProps}
      {...props}
    >
      {children}
    </SwipeableBottomSheet>
  )
}

export default SwipeableSheet
