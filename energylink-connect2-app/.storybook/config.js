import { addDecorator, configure } from '@storybook/react';
import { addParameters } from '@storybook/react';
import { withProvider } from './decorators';
import suntheme from './suntheme';

import '@sunpower/theme-dark';

addParameters({
  options: {
    theme: suntheme,
  }
})

addDecorator(withProvider)

const req = require.context('../src/stories', true, /\.stories\.js$/);
const reqc = require.context('../src/components', true, /\.stories\.js$/);
const reqp = require.context('../src/pages', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
  reqc.keys().forEach(filename => reqc(filename));
  reqp.keys().forEach(filename => reqp(filename));
}

configure(loadStories, module);
