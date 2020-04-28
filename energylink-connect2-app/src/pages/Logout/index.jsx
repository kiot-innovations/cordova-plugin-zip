import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { LOGOUT } from 'state/actions/auth'

function Logout() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(LOGOUT())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className="section content page-height">Loggin out...</div>
}

export default Logout
