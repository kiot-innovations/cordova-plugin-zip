import { isEmpty } from 'ramda'
import React, { useEffect, useState } from 'react'

import appVersion from '../../macros/appVersion.macro'

import { Loader } from 'components/Loader'
import ReleaseNotes from 'components/ReleaseNotes'

let loadedRN = {}

function VersionInformation({ currentVersion }) {
  const version = currentVersion ? currentVersion : appVersion()
  const [json, setJSON] = useState({})

  useEffect(() => {
    const fetchNotes = async () => {
      const rnModule = await import('./releaseNotes')
      loadedRN = rnModule.default
      setJSON(loadedRN)
    }
    if (isEmpty(loadedRN))
      fetchNotes()
        .then(console.info)
        .catch(console.error)
    else setJSON(loadedRN)
  }, [])

  return isEmpty(json) ? (
    <Loader />
  ) : (
    <ReleaseNotes
      title="PRO_CONNECT_VERSION_INFORMATION"
      releaseNotes={json}
      currentVersion={version}
    />
  )
}

export default VersionInformation
