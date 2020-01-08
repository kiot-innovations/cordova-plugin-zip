import React from 'react'
import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'

import './SystemConfiguration.scss'

const GBI = <span className="sp-grid file level mr-15 is-size-4" />
const MCI = <span className="sp-meter file level mr-15 is-size-4" />
const STI = <span className="sp-battery file level mr-15 is-size-4" />
const NWI = <span className="sp-wifi file level mr-15 is-size-4" />

function SystemConfiguration() {
  // const { modules, meters } = useSelector(mapStateToProps)
  // const dispatch = useDispatch()
  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered system-config pl-10 pr-10">
      <span className="is-uppercase has-text-weight-bold mb-20">
        System Configuration
      </span>

      <div className="pb-15">
        <Collapsible title="Grid Behavior" icon={GBI} expanded>
          <div className="field is-horizontal">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                Grid Profile
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <p className="control">
                  <SelectField
                    isSearchable={false}
                    useDefaultDropDown
                    options={[{ label: 'Option 1', value: 'Option 1' }]}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className="field is-horizontal mb-20">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                Customer Self Supply
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <p className="control">
                  <SelectField
                    isSearchable={false}
                    useDefaultDropDown
                    options={[{ label: 'Yes', value: true }]}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className="field is-horizontal mb-15">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                Grid Voltaje
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <p className="control">
                  <SelectField
                    isSearchable={false}
                    useDefaultDropDown
                    options={[{ label: 'Grid Voltaje', value: '208V' }]}
                    defaultValue={{ label: 'Grid Voltaje', value: '208V' }}
                    value="208V"
                  />
                </p>
              </div>
            </div>
          </div>
        </Collapsible>
      </div>

      <div className="pb-15">
        <Collapsible title="Meter / CT" icon={MCI}>
          <div className="field is-horizontal mb-15">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                Consumption CT
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <p className="control">
                  <SelectField
                    isSearchable={false}
                    useDefaultDropDown
                    options={[{ label: 'Grid Voltaje', value: '208V' }]}
                    defaultValue={{ label: 'Line Side', value: 'lineSide' }}
                  />
                </p>
              </div>
            </div>
          </div>

          <div className="field is-horizontal mb-15">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                Rated Current
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <p className="control">
                  <SelectField
                    isSearchable={false}
                    useDefaultDropDown
                    options={[{ label: '100', value: '100' }]}
                    defaultValue={{ label: '100', value: '100' }}
                  />
                  <p className="control">amps</p>
                </p>
              </div>
            </div>
          </div>

          <div className="field is-horizontal mb-15">
            <div className="field-label">
              <label htmlFor="siteName" className="label has-text-white">
                Production CT
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <p className="control">
                  <SelectField
                    isSearchable={false}
                    useDefaultDropDown
                    options={[{ label: 'Used', value: 'used' }]}
                    defaultValue={{ label: 'Used', value: 'no' }}
                  />
                </p>
              </div>
            </div>
          </div>
        </Collapsible>
      </div>

      <div className="pb-15">
        <Collapsible title="Storage" icon={STI} />
      </div>

      <div className="pb-15">
        <Collapsible title="Network" icon={NWI}>
          <form>
            <div className="field is-horizontal mb-15">
              <div className="field-label">
                <label htmlFor="siteName" className="label has-text-white">
                  Network
                </label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <SelectField
                      isSearchable={false}
                      useDefaultDropDown
                      placeholder="Select Network"
                      options={[
                        { label: 'PVS1', value: 'pvs1' },
                        { label: 'PVS2', value: 'pvs2' }
                      ]}
                    />
                  </p>
                </div>
              </div>
            </div>

            <div className="field is-horizontal mb-15">
              <div className="field-label">
                <label htmlFor="siteName" className="label has-text-white">
                  Password
                </label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input
                      className="input"
                      type="password"
                      placeholder="********"
                    />
                  </p>
                </div>
              </div>
            </div>

            <div className="field is-grouped is-grouped-centered">
              <p className="control">
                <button className="button is-primary is-outlined">
                  Use WPS
                </button>
              </p>
              <p className="control">
                <button className="button is-light is-uppercase">
                  Connect
                </button>
              </p>
            </div>
          </form>
        </Collapsible>
      </div>
    </div>
  )
}
export default SystemConfiguration
