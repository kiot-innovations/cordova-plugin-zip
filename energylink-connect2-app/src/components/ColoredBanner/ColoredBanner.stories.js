import { storiesOf } from '@storybook/react'
import React from 'react'

import ColoredBanner, { bannerCategories } from '.'

storiesOf('Banner', module)
  .add('All banners, no action', () => (
    <div className="full-min-height pt-20 pb-20 pr-20 pl-20">
      <ColoredBanner
        category={bannerCategories.INFO}
        text="This is an informative banner. No action required."
        className="mb-20"
      />
      <ColoredBanner
        category={bannerCategories.WARNING}
        text="This is a warning banner. No action required."
        className="mb-20"
      />
      <ColoredBanner
        category={bannerCategories.ERROR}
        text="This is an error banner. No action required."
        className="mb-20"
      />
      <ColoredBanner
        category={bannerCategories.SUCCESS}
        text="This is a success banner. No action required."
        className="mb-20"
      />
    </div>
  ))
  .add('All banners, with actions', () => (
    <div className="full-min-height pt-20 pb-20 pr-20 pl-20">
      <ColoredBanner
        category={bannerCategories.INFO}
        text="This is an informative banner, with an action."
        actionText="Do something"
        className="mb-20"
      />
      <ColoredBanner
        category={bannerCategories.WARNING}
        text="This is a warning banner, with an action."
        actionText="Do something"
        className="mb-20"
      />
      <ColoredBanner
        category={bannerCategories.ERROR}
        text="This is an error banner, with an action."
        actionText="Do something"
        className="mb-20"
      />
      <ColoredBanner
        category={bannerCategories.SUCCESS}
        text="This is a success banner, with an action."
        actionText="Do something"
        className="mb-20"
      />
    </div>
  ))
  .add('Info - No action', () => (
    <div className="full-min-height pt-20 pb-20 pr-20 pl-20">
      <ColoredBanner
        category={bannerCategories.INFO}
        text="This is an informative banner. No action required."
      />
    </div>
  ))
  .add('Info - With action', () => (
    <div className="full-min-height pt-20 pb-20 pr-20 pl-20">
      <ColoredBanner
        category={bannerCategories.INFO}
        text="This is an informative banner with an attached action."
        actionText="Action to do"
      />
    </div>
  ))
  .add('Warning', () => (
    <div className="full-min-height pt-20 pb-20 pr-20 pl-20">
      <ColoredBanner
        category={bannerCategories.WARNING}
        text="This is a warning, do something about it."
        actionText="Do something about it"
      />
    </div>
  ))
  .add('Error', () => (
    <div className="full-min-height pt-20 pb-20 pr-20 pl-20">
      <ColoredBanner
        category={bannerCategories.ERROR}
        text="Something really bad happened"
        actionText="Do something about it"
      />
    </div>
  ))
  .add('Success', () => (
    <div className="full-min-height pt-20 pb-20 pr-20 pl-20">
      <ColoredBanner
        category={bannerCategories.SUCCESS}
        text="This a success banner"
      />
    </div>
  ))
