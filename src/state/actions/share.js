import { createAction } from 'redux-act'
import html2canvas from 'html2canvas'

export const CONVERT_BASE64_INIT = createAction('CONVERT_BASE64_INIT')
export const CONVERT_BASE64_SUCCESS = createAction('CONVERT_BASE64_SUCCESS')
export const CONVERT_BASE64_ERROR = createAction('CONVERT_BASE64_ERROR')

export const convertToCanvas = (elementId, options = {}) => {
  const {
    onCloneElement = () => {},
    widthOffset = 10,
    heightOffset = 10,
    ...restOptions
  } = options
  return async dispatch => {
    dispatch(CONVERT_BASE64_INIT())
    try {
      const element = document.getElementById(elementId)
      const elemRect = element.getBoundingClientRect()
      const canvas = await html2canvas(document.body, {
        scale: 3,
        width: elemRect.width + widthOffset,
        height: elemRect.height + heightOffset,
        backgroundColor: null,
        scrollY: 0,
        scrollX: 0,
        foreignObjectRendering: true,
        ignoreElements: element =>
          (element.getAttribute('class') || '').includes('ignore-in-share'),
        onclone: doc => {
          const elementClone = doc.getElementById(elementId)
          doc.body.innerHTML = ''
          doc.body.style.padding = '10px'
          doc.body.style.background =
            'linear-gradient(180deg, #2B4053 0%, #1B2A3A 100%)'
          doc.body.append(elementClone)
          onCloneElement(elementClone)
        },
        ...restOptions
      })

      const dataUrl = canvas.toDataURL()
      dispatch(CONVERT_BASE64_SUCCESS(dataUrl))
    } catch (e) {
      dispatch(CONVERT_BASE64_ERROR(e))
    }
  }
}
