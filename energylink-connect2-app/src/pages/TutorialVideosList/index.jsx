import { propOr } from 'ramda'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { ButtonLink } from 'components/ButtonLink'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { SET_TUTORIAL } from 'state/actions/knowledgeBase'

function TutorialVideosList() {
  const history = useHistory()
  const dispatch = useDispatch()
  const t = useI18n()

  const { tutorialList } = useSelector(propOr([], 'knowledgeBase'))

  const pushTutorial = tutorial => {
    dispatch(SET_TUTORIAL(tutorial))
    history.push(paths.PROTECTED.TUTORIAL_VIDEO.path)
  }

  const goBack = () => history.goBack()

  return (
    <section className="is-flex tile is-vertical section pt-0 fill-parent">
      <div className="header mb-15">
        <span
          className="sp-chevron-left has-text-primary is-size-4 go-back"
          onClick={goBack}
        />
        <span className="is-uppercase" role="button">
          {t('TUTORIAL_VIDEOS')}
        </span>
      </div>
      {tutorialList.map(tutorial => (
        <ButtonLink
          key={tutorial.title}
          title={tutorial.title}
          onClick={() => pushTutorial(tutorial)}
        />
      ))}
    </section>
  )
}

export default TutorialVideosList
