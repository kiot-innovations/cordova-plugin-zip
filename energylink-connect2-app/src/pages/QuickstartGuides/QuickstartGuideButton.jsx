import React from 'react'

import { ButtonLink } from 'components/ButtonLink'
import { createExternalLinkHandler } from 'shared/routing'

const QuickstartGuideButton = ({
  title,
  icon = 'sp-download',
  link,
  iconSize = 5
}) => (
  <ButtonLink
    title={title}
    icon={icon}
    onClick={createExternalLinkHandler(link)}
    size={iconSize}
  />
)

export default QuickstartGuideButton
