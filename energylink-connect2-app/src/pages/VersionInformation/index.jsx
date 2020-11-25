import React from 'react'
import appVersion from '../../macros/appVersion.macro'
import ReleaseNotes from 'components/ReleaseNotes'
import * as releaseNotes from './releaseNotes.json'

function VersionInformation() {
  const currentVersion = appVersion()

  return (
    <ReleaseNotes
      title="PRO_CONNECT_VERSION_INFORMATION"
      releaseNotes={releaseNotes.default}
      currentVersion={currentVersion}
    />
  )
}

export default VersionInformation
