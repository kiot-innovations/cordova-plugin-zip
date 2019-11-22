import React from 'react'
import Collapsible from 'components/Collapsible'
import { useI18n } from 'shared/i18n'

const actions = <span className="sp-stop is-size-4" />

function Firmwares() {
  const t = useI18n()

  return (
    <section className="is-flex tile is-vertical pt-0 pr-10 pl-10 fill-parent">
      <h1 className="has-text-centered is-uppercase pb-20">{t('FIRMWARE')}</h1>

      <Collapsible title="PVS6 FW 3.1" actions={actions} expanded>
        <p>This update contains the following fixes:</p>

        <ul>
          <li>-Changelog item 1</li>
          <li>-Changelog item 2</li>
          <li>-Changelog item 3</li>
          <li>-Changelog item 4</li>
        </ul>

        <section className="mt-20 mb-10">
          <p className="mb-5">
            <span className="mr-10 has-text-white has-text-weight-bold">
              40%
            </span>
            Downloading
            <span className="is-pulled-right has-text-white has-text-weight-bold">
              348.57mb
            </span>
          </p>

          <progress
            className="progress is-tiny is-white"
            value="40"
            max="100"
          />
        </section>
      </Collapsible>
    </section>
  )
}

export default Firmwares
