import { isEmpty, propOr } from 'ramda'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { ButtonLink } from 'components/ButtonLink'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'

function KnowledgeBase() {
  const t = useI18n()
  const history = useHistory()

  const { tutorialList } = useSelector(propOr([], 'knowledgeBase'))

  const pushQuickstartGuides = () =>
    history.push(paths.PROTECTED.QUICKSTART_GUIDES.path)

  const pushTutorialVideos = () =>
    history.push(paths.PROTECTED.TUTORIAL_VIDEOS_LIST.path)

  return (
    <section className="is-flex tile is-vertical section pt-0 fill-parent">
      <h1 className="has-text-centered is-uppercase has-text-weight-bold pb-20">
        {t('KNOWLEDGE_BASE')}
      </h1>
      <ButtonLink
        title={t('QUICKSTART_GUIDES')}
        onClick={pushQuickstartGuides}
      />
      {either(
        !isEmpty(tutorialList),
        <ButtonLink title={t('TUTORIAL_VIDEOS')} onClick={pushTutorialVideos} />
      )}
    </section>
  )
}

export default KnowledgeBase
