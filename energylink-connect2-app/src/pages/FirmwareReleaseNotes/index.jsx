import React from 'react'
import { useSelector } from 'react-redux'
import { pathOr } from 'ramda'

import ReleaseNotes from 'components/ReleaseNotes'

function FirmwareReleaseNotes() {
  const releaseNotes = useSelector(
    pathOr({}, ['firmwareUpdate', 'releaseNotes'])
  )

  return (
    <ReleaseNotes
      title="PVS_FIRMWARE_RELEASE_NOTES"
      releaseNotes={releaseNotes}
    />
  )
}

export default FirmwareReleaseNotes
