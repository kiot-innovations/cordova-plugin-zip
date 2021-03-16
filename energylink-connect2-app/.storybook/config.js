import { addDecorator, configure } from '@storybook/react'
import { addParameters } from '@storybook/react'
import { withProvider } from './decorators'
import { initializeWorker, mswDecorator } from 'msw-storybook-addon';

import suntheme from './suntheme'

import '@sunpower/theme-dark'

addParameters({
  options: {
    theme: suntheme
  }
})

initializeWorker();

addDecorator(mswDecorator);
addDecorator(withProvider)

const req = require.context('../src/stories', true, /\.stories\.js$/)
const reqc = require.context('../src/components', true, /\.stories\.js$/)
const reqp = require.context('../src/pages', true, /\.stories\.js$/)

function loadStories() {
  const modalRoot = document.createElement('div')
  modalRoot.setAttribute('id', 'modal-root')
  document.body.append(modalRoot)
  req.keys().forEach(filename => req(filename))
  reqc.keys().forEach(filename => reqc(filename))
  reqp.keys().forEach(filename => reqp(filename))
}

configure(loadStories, module)
