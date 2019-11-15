export const SET_HEADER = '[ UI ] SET HEADER'
export const SET_FOOTER = '[ UI ] SET FOOTER'

export const setHeader = (open = false) => ({ type: SET_HEADER, payload: open })

export const setFooter = (open = false) => ({ type: SET_FOOTER, payload: open })
