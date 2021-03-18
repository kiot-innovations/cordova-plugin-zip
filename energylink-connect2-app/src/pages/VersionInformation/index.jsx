import React from 'react'
import appVersion from '../../macros/appVersion.macro'
import releaseNotesJSON from './releaseNotes'
import ReleaseNotes from 'components/ReleaseNotes'

function VersionInformation(props) {
  const currentVersion = props.appVersion || appVersion()
  return (
    <ReleaseNotes
      title="PRO_CONNECT_VERSION_INFORMATION"
      releaseNotes={releaseNotesJSON}
      currentVersion={currentVersion}
    />
  )
}

export default VersionInformation
