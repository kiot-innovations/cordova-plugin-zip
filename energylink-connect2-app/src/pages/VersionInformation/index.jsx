import { isEmpty } from 'ramda'
import React from 'react'

import appVersion from '../../macros/appVersion.macro'

import { Loader } from 'components/Loader'
import ReleaseNotes from 'components/ReleaseNotes'

function VersionInformation({ currentVersion }) {
  const releaseNotes = localStorage.getItem('releaseNotes')
  const parsedNotes = JSON.parse(releaseNotes)
  const version = currentVersion ? currentVersion : appVersion()

  return isEmpty(parsedNotes) ? (
    <Loader />
  ) : (
    <ReleaseNotes
      title="PRO_CONNECT_VERSION_INFORMATION"
      releaseNotes={parsedNotes}
      currentVersion={version}
    />
  )
}

export default VersionInformation
