import { find, isEmpty, propEq } from 'ramda'
import { createReducer } from 'redux-act'

import {
  SET_TUTORIAL,
  RESET_TUTORIAL,
  UPDATE_TUTORIALS,
  UPDATE_ARTICLES,
  UPDATE_ARTICLES_ERROR,
  UPDATE_ARTICLES_SUCCESS,
  CLEAR_SELECTED_ARTICLE,
  SELECT_ARTICLE
} from 'state/actions/knowledgeBase'

export const status = {
  NEVER_FETCHED: 'neverFetched',
  FETCHED: 'fetched',
  UNKNOWN: 'unknown'
}

const placeholderArticle = {
  id: 0,
  name: 'Article not found',
  title: 'Article not found',
  source_locale: 'en-us',
  locale: 'en-us',
  edited_at: '',
  body:
    "<p>We could not find the article you're looking for - please call SunPower for assistance</p>"
}

const initialState = {
  tutorialList: [],
  currentTutorial: {},
  status: status.NEVER_FETCHED,
  lastSuccessfulUpdateOn: 0,
  articles: [],
  fetchingArticles: false,
  externallySelectedArticle: {}
}

const retrieveArticle = (articleId, articles) => {
  const article = find(propEq('id', articleId), articles)
  return isEmpty(article) ? placeholderArticle : article
}

export default createReducer(
  {
    [SET_TUTORIAL]: (state, payload) => ({
      ...state,
      currentTutorial: payload
    }),
    [RESET_TUTORIAL]: state => ({
      ...state,
      currentTutorial: {}
    }),
    [UPDATE_TUTORIALS]: (state, { tutorialList, timestamp, status }) => ({
      ...state,
      tutorialList: tutorialList,
      lastSuccessfulUpdateOn: timestamp,
      status: status
    }),
    [UPDATE_ARTICLES]: state => ({
      ...state,
      fetchingArticles: true
    }),
    [UPDATE_ARTICLES_SUCCESS]: (state, payload) => ({
      ...state,
      fetchingArticles: false,
      articles: payload
    }),
    [UPDATE_ARTICLES_ERROR]: state => ({
      ...state,
      fetchingArticles: false
    }),
    [SELECT_ARTICLE]: (state, payload) => ({
      ...state,
      externallySelectedArticle: retrieveArticle(payload, state.articles)
    }),
    [CLEAR_SELECTED_ARTICLE]: state => ({
      ...state,
      externallySelectedArticle: initialState.externallySelectedArticle
    })
  },
  initialState
)
