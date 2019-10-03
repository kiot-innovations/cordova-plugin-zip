import React from 'react'
import clsx from 'clsx'
import ModalLayout from '../../components/ModalLayout'
import SocialFooter from '../../components/SocialFooter'
import BlockGrid from '../../components/BlockGrid'
import BlockItem from '../../components/BlockItem'
import SunPowerImage from '../../components/SunPowerImage'
import paths from '../Router/paths'
import { useI18n } from '../../shared/i18n'
import { HelpIcon, LearningIcon, SettingsIcon } from './Icons'

import './Menu.scss'

function Menu({ history, location, className }) {
  const t = useI18n()
  const classes = clsx('menu-modal', className)

  return (
    <ModalLayout
      className={classes}
      history={history}
      imageHeader={<SunPowerImage inverse />}
      from={location && location.state && location.state.from}
    >
      <BlockGrid location={location}>
        <BlockItem
          title={t('SETTINGS')}
          to={paths.SETTINGS}
          icon={<SettingsIcon />}
        />
        <BlockItem
          title={t('HELP_CENTER')}
          to={paths.MENU_HELP_CENTER}
          icon={<HelpIcon />}
        />
        <BlockItem
          title={t('LEARNING_CENTER')}
          to={paths.MENU_LEARNING_CENTER}
          icon={<LearningIcon />}
        />
      </BlockGrid>
      <div className="mt-50 mb-20 pl-10 pr-10">
        <SocialFooter />
      </div>
    </ModalLayout>
  )
}

export default Menu
