import React from 'react'
import { EditIcon } from './icons'
import { Link } from 'react-router-dom'
import './ProfileLabel.scss'

function ProfileLabel({ title, content, to, location = null }) {
  return (
    <div className="profile-label">
      <div className="text pt-20 pb-20">
        <h2 className="is-uppercase is-size-7">{title}</h2>
        <h2 className="mt-5">{content}</h2>
      </div>
      <div className="edit">
        <Link
          to={{
            pathname: to,
            state: {
              from: location && location.pathname
            }
          }}
        >
          <EditIcon />
        </Link>
      </div>
    </div>
  )
}

export default ProfileLabel
