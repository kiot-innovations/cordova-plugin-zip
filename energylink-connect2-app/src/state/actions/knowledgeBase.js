import { createAction } from 'redux-act'

export const SET_TUTORIAL = createAction('SET_TUTORIAL')
export const RESET_TUTORIAL = createAction('RESET_TUTORIAL')

export const UPDATE_TUTORIALS = createAction('UPDATE_TUTORIALS')
export const UPDATE_TUTORIALS_ERROR = createAction('UPDATE_TUTORIALS_ERROR')

export const UPDATE_ARTICLES = createAction('UPDATE_ARTICLES')
export const UPDATE_ARTICLES_SUCCESS = createAction('UPDATE_ARTICLES_SUCCESS')
export const UPDATE_ARTICLES_ERROR = createAction('UPDATE_ARTICLES_ERROR')

export const SELECT_ARTICLE = createAction('EXTERNALLY_SELECT_ARTICLE')
export const CLEAR_SELECTED_ARTICLE = createAction('CLEAR_SELECTED_ARTICLE')
