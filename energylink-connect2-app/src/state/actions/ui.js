import { createAction } from 'redux-act'

export const SET_HEADER = '[ UI ] SET HEADER'
export const SET_FOOTER = '[ UI ] SET FOOTER'
export const MENU_SHOW = createAction('[ UI ] MENU_SHOW')
export const MENU_HIDE = createAction('[ UI ] MENU_HIDE')
export const MENU_DISPLAY_ITEM = createAction('[ UI ] MENU_DISPLAY_ITEM')

export const setHeader = (open = false) => ({ type: SET_HEADER, payload: open })

export const setFooter = (open = false) => ({ type: SET_FOOTER, payload: open })
