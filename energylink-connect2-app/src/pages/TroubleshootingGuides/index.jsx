import { head, isEmpty, map } from 'ramda'
import React, { useEffect, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { ButtonLink } from 'components/ButtonLink'
import ColoredBanner, { bannerCategories } from 'components/ColoredBanner'
import { zendeskToken } from 'shared/api'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import {
  CLEAR_SELECTED_ARTICLE,
  UPDATE_ARTICLES
} from 'state/actions/knowledgeBase'

import './TroubleshootingGuides.scss'

function replaceImages() {
  document.querySelectorAll('img[src]').forEach(image => {
    //protect from redoing work that isn't necessary
    if (!image.src.startsWith('blob:')) {
      const xhr = new XMLHttpRequest()
      //so you can access the response like a normal URL
      xhr.responseType = 'blob'
      xhr.open('GET', image.src, true)
      xhr.setRequestHeader('authorization', `Basic ${zendeskToken}`)
      xhr.send()
      xhr.onreadystatechange = async function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          var img = document.createElement('img')
          //create <img> with src set to the blob
          img.src = URL.createObjectURL(xhr.response)
          image.replaceWith(img)
        }
      }
    }
  })
}

function TroubleshootingGuides() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const { articles, fetchingArticles, externallySelectedArticle } = useSelector(
    state => state.knowledgeBase
  )

  const [selectedArticle, setSelectedArticle] = useState({})

  const renderArticle = article => {
    // Some articles might reference // and this needs to be
    // replaced with https:// explicitly because cordova/react
    // defaults it to file:// which is not valid in this case.
    article.body = article.body.replace(
      new RegExp('<img src="//', 'g'),
      '<img src="https://'
    )

    return (
      <ButtonLink
        title={article.title}
        onClick={() => {
          setSelectedArticle(article)
          // There is a race condition here and we need to replace
          // images after the dom is set.
          setTimeout(replaceImages, 500)
          // Do this in here twice to cover slower phones that
          // might take longer to render the DOM. If the first
          // attempt did what it is supposed to then this does nothing.
          setTimeout(replaceImages, 1000)
        }}
      />
    )
  }

  const goBack = () => {
    if (isEmpty(externallySelectedArticle)) {
      setSelectedArticle({})
    } else {
      dispatch(CLEAR_SELECTED_ARTICLE())
      history.goBack()
    }
  }

  const processHtmlNodes = node => {
    if (node.name === 'a') {
      const text = head(node.children)
      return (
        <span
          className="link-style has-text-primary"
          onClick={() =>
            window.open(node.attribs.href, '_system', 'usewkwebview=yes')
          }
        >
          {text.data}
        </span>
      )
    }
  }

  useEffect(() => {
    if (!isEmpty(externallySelectedArticle)) {
      setSelectedArticle(externallySelectedArticle)
      setTimeout(replaceImages, 500)
      setTimeout(replaceImages, 1000)
    }
  }, [externallySelectedArticle])

  return (
    <main className="full-height pl-10 pr-10 troubleshooting-guides">
      <div className="has-text-centered mt-15 mb-15">
        {either(
          isEmpty(selectedArticle),
          <span className="is-uppercase has-text-weight-bold page-title">
            {t('TROUBLESHOOTING_GUIDES')}
          </span>,
          <div className="viewing-article">
            <span
              onClick={goBack}
              className="sp-chevron-left is-size-4 has-text-primary"
            />
            <span className="has-text-weight-bold page-title">
              {selectedArticle.name}
            </span>
          </div>
        )}
      </div>
      {either(
        isEmpty(selectedArticle),
        <div className="content pb-20">
          {either(
            fetchingArticles,
            <ColoredBanner
              className="mb-10"
              category={bannerCategories.INFO}
              text={t('UPDATING_ARTICLES')}
            />
          )}
          {
            (either(
              isEmpty(articles),
              <div className="no-articles has-text-centered">
                <div className="mb-15">
                  <span className="sp-hey is-size-1" />
                </div>
                <div className="mb-15">
                  <span>{t('NO_ARTICLES')}</span>
                </div>
                <div>
                  <button
                    className="button is-primary"
                    onClick={() => dispatch(UPDATE_ARTICLES())}
                  >
                    {t('GET_ARTICLES')}
                  </button>
                </div>
              </div>
            ),
            map(renderArticle, articles))
          }
        </div>,
        <div>
          {ReactHtmlParser(selectedArticle.body, {
            transform: processHtmlNodes
          })}
        </div>
      )}
    </main>
  )
}

export default TroubleshootingGuides
