import React from 'react';
import Provider from '../src/stories/Provider';

export const withProvider = story => (
  <Provider>
    {story()}
  </Provider>
)
