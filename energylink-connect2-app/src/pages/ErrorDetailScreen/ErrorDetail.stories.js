import { storiesOf } from '@storybook/react'
import React from 'react'
import { Route, Link } from 'react-router-dom'
import StoryRouter from 'storybook-react-router'

import ErrorDetailScreen from './ErrorDetail'

const ErrorCodes = () => (
  <div>
    <h1 className="mt-10 mb-10 has-text-centered is-uppercase">Error codes</h1>

    <Route path="/" exact>
      <ul>
        <li>
          <Link to="/error/30002">30002</Link>
        </li>
        <li>
          <Link to="/error/32003">32003</Link>
        </li>
        <li>
          <Link to="/error/70000">70000 (unknow error code)</Link>
        </li>
      </ul>
    </Route>

    <Route path="/error/:errorCode" component={ErrorDetailScreen} />
  </div>
)

storiesOf('ErrorDetailScreen', module)
  .addDecorator(StoryRouter())
  .add('Rendered', () => (
    <div className="full-min-height pl-10 pr-10">
      <ErrorCodes />
    </div>
  ))
