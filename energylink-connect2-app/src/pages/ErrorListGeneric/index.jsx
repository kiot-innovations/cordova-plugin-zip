import React from 'react'
import './ErrorListScreen.scss'
import { Link } from 'react-router-dom'
import paths, { setParams } from 'routes/paths'

const ErrorComponent = ({ title, code }) => (
  <div className="error-component">
    <h1 className="has-text-white has-text-weight-bold is-size-5 mb-10">
      {title}
    </h1>
    <span className="error-code">Error code {code}</span>

    <Link
      className="sp sp-chevron-right has-text-primary is-size-1 details"
      to={setParams([code], paths.PROTECTED.ERROR_DETAIL.path)}
    />
  </div>
)

/**
 *
 * @param errors array of errors {error_description,code,event_code}
 * @returns React.Component
 * @constructor
 */
const ErrorListScreen = ({ errors = [] }) => {
  return (
    <div className="error-list-screen">
      {errors.map(elem => (
        <ErrorComponent
          title={elem.error_description}
          code={elem.code}
          key={elem.event_code}
        />
      ))}
      <div className="actions">
        <button className="button button-transparent has-text-primary is-uppercase mb-20 mt-20">
          cancel commissioning
        </button>
        <span className="mt-10 mb-10">
          Please make sure to fix the errors above
        </span>
        <span className="mb-20 mt-10">
          Go back and try again to verify the errors have been fixed
        </span>
      </div>
    </div>
  )
}

export default ErrorListScreen
