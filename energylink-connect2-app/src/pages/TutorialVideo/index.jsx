import { pathOr, compose, last, split, propOr } from 'ramda'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import EmbedVideo from 'components/EmbedVideo'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'

const NoInternetView = ({ goBack }) => {
  const t = useI18n()

  return (
    <div>
      <div className="is-flex flex-column has-text-centered mb-40">
        <span className="sp-no-connection is-size-1 mb-25 mt-30" />
        <span className="has-text-weight-bold is mb-20">
          {t('PVS_NO_INTERNET_INTERFACE')}
        </span>
        <span>{t('NO_CONNECTION_TUTORIALS')}</span>
      </div>
      <div className="has-text-centered">
        <button
          className="button is-primary is-uppercase is-outlined"
          onClick={goBack}
        >
          {t('BACK')}
        </button>
      </div>
    </div>
  )
}

const TutorialVideo = () => {
  const history = useHistory()

  const { title, video } = useSelector(
    pathOr({}, ['knowledgeBase', 'currentTutorial'])
  )

  const { hasInternetConnection } = useSelector(propOr(false, 'network'))

  const getEmbedId = compose(last, split('/'))

  const goBack = () => history.goBack()

  return (
    <section className="is-flex tile is-vertical section pt-0 fill-parent">
      <div className="header mb-15">
        <span
          className="sp-chevron-left has-text-primary is-size-4 go-back"
          onClick={goBack}
        />
        <span className="is-uppercase" role="button">
          {title}
        </span>
      </div>
      {either(
        hasInternetConnection,
        <EmbedVideo title={title} embedId={getEmbedId(video)} />,
        <NoInternetView goBack={goBack} />
      )}
    </section>
  )
}

export default TutorialVideo
