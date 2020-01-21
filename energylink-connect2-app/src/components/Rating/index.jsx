import React from 'react'
import { Star } from '../Icons'

import './Rating.scss'

function Rating({ rating = 1, onClick = () => {} }) {
  return (
    <div className="column raitings">
      <Star
        className={`${rating >= 1 ? 'active' : ''}`}
        onClick={() => onClick(1)}
      />
      <Star
        className={`${rating >= 2 ? 'active' : ''}`}
        onClick={() => onClick(2)}
      />
      <Star
        className={`${rating >= 3 ? 'active' : ''}`}
        onClick={() => onClick(3)}
      />
      <Star
        className={`${rating >= 4 ? 'active' : ''}`}
        onClick={() => onClick(4)}
      />
      <Star
        className={`${rating >= 5 ? 'active' : ''}`}
        onClick={() => onClick(5)}
      />
    </div>
  )
}

export default Rating
