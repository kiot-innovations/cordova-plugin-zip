import React, { useState, useEffect } from 'react'
import { isNil, pathOr, propOr, prop } from 'ramda'
import moment from 'moment'
import { useI18n } from 'shared/i18n'
import Collapsible from 'components/Collapsible'
import { createMarkup, either } from 'shared/utils'
import { useSelector } from 'react-redux'

import './ReleaseNotes.scss'

const ReleaseNotes = ({ title, releaseNotes, currentVersion = null }) => {
  const t = useI18n()
  const [versions, setVersions] = useState(propOr([], 'versions', releaseNotes))

  useEffect(() => {
    setVersions(propOr([], 'versions', releaseNotes))
  }, [releaseNotes])

  const fwFileInfo = useSelector(pathOr('', ['fileDownloader', 'fileInfo']))
  if (isNil(currentVersion)) {
    currentVersion = prop('version', fwFileInfo)
  }

  return (
    <section className="release-notes is-flex tile is-vertical pt-0 pr-10 pl-10 full-height">
      <h1 className="has-text-centered is-uppercase pb-20">{t(title)}</h1>

      {either(
        versions.length > 0,
        <div className="body has-text-white">
          {versions.map((version, index) => {
            const versionNumber = version.versionNumber
            const title = `${t('VERSION')} ${versionNumber}`
            const isFirstVersionInList = index === 0
            const { releaseDate, bodyMarkdown } = version
            return (
              <div className="version" key={index}>
                {//show the previous release notes title
                //above the second set of release notes.
                index === 1 && (
                  <div className="previous-release-notes">
                    {t('PREVIOUS_RELEASE_NOTES')}
                  </div>
                )}
                <div className="mb-10">
                  <Collapsible title={title} expanded={isFirstVersionInList}>
                    <div className="releaseDate">
                      {t('RELEASE_DATE')}{' '}
                      {moment(releaseDate).format('MM/DD/YYYY')}
                    </div>
                    <div
                      className="content"
                      dangerouslySetInnerHTML={createMarkup(bodyMarkdown)}
                    />
                  </Collapsible>
                </div>
              </div>
            )
          })}
        </div>,
        <div className="body has-text-white">
          <div className="collapsible">
            <h1 class="mb-10">
              {t('CURRENT_VERSION')}: {currentVersion}
            </h1>
            <p>{t('UNABLE_TO_RETRIEVE_RELEASE_NOTES')}</p>
          </div>
        </div>
      )}

      {either(
        currentVersion,
        <div className="currentVersion">
          {t('CURRENT_VERSION')} {currentVersion}
        </div>
      )}
    </section>
  )
}

export default ReleaseNotes
