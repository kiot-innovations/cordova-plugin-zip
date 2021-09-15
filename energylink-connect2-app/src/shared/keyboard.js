import { isIos } from './utils'

export const turnOnKeyboardShrinkView = (enableOrDisable = true) => {
  if (isIos()) {
    window.Keyboard.disableScrollingInShrinkView(enableOrDisable)

    setTimeout(() => {
      window.Keyboard.shrinkView(enableOrDisable)
    }, 300)
  }
}
