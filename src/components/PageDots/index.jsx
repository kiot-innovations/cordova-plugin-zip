import React from 'react'
import './PageDots.scss'

function PageDots({ totalDots = 4, selectedDot = 1 }) {
  totalDots = parseInt(totalDots, 10)
  selectedDot = parseInt(selectedDot, 10)

  const dots = [...Array(totalDots)].map((_, index) => {
    let classes = 'dot'
    if (index + 1 === selectedDot) {
      classes += ' selected'
    } else if (index + 1 < selectedDot) {
      classes += ' previous'
    }
    return <div key={`dot${index}`} className={classes}></div>
  })
  return <div className="page-dots container has-text-centered">{dots}</div>
}

export default PageDots
