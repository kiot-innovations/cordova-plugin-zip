import React from 'react'
import { useI18n } from 'shared/i18n'

import Collapsible from 'components/Collapsible'

const STI = <span className="sp-battery file level mr-15 is-size-4" />

function StorageWidget() {
  const t = useI18n()

  return (
    <div className="pb-15">
      <Collapsible title={t('STORAGE')} icon={STI}>
        <section className="box is-flex space-around has-background-black has-text-grey pl-10 pr-10">
          <article>
            <h6 className="is-size-5 has-text-white">4 batteries</h6>
            <ul>
              <li>30849</li>
              <li>30849</li>
              <li>30849</li>
              <li>30849</li>
            </ul>
          </article>

          <article>
            <h6 className="is-size-5 has-text-white">Inverter</h6>
            <ul>
              <li>00001B3E9C74</li>
            </ul>

            <h6 className="is-size-5 has-text-white mt-20">Inverter Gateway</h6>
            <ul>
              <li>Installed</li>
            </ul>
          </article>
        </section>

        <section className="box is-flex space-around has-background-black has-text-grey pl-10 pr-10">
          <article>
            <h6 className="is-size-5 has-text-white">2 batteries</h6>
            <ul>
              <li>30849</li>
              <li>30849</li>
            </ul>
          </article>

          <article>
            <h6 className="is-size-5 has-text-white">Inverter</h6>
            <ul>
              <li>00001B3E9C74</li>
            </ul>
          </article>
        </section>
      </Collapsible>
    </div>
  )
}
export default StorageWidget
