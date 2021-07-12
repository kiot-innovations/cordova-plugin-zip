import { storiesOf } from '@storybook/react'
import React from 'react'

import FileCollapsible from './index'

storiesOf('File collapsible', module).add('Downloading', () => (
  <div className="full-min-height pl-10 pr-10">
    <FileCollapsible
      fileName="File downloading"
      progress={20}
      step="DOWNLOADING"
      isDownloading
    />
  </div>
))
storiesOf('File collapsible', module).add('Saving file', () => (
  <div className="full-min-height pl-10 pr-10">
    <FileCollapsible
      fileName="Writing file"
      step="WRITING_FILE"
      isDownloading
      progress={40}
    />
  </div>
))

storiesOf('File collapsible', module).add('Downloaded', () => (
  <div className="full-min-height pl-10 pr-10">
    <FileCollapsible
      size={40.3}
      fileName="File completely downloaded"
      isDownloaded={true}
    />
  </div>
))

storiesOf('File collapsible', module).add('Error', () => (
  <div className="full-min-height pl-10 pr-10">
    <FileCollapsible fileName="With Error" error="something happened" />
  </div>
))
