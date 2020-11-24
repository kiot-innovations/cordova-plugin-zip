import { createExternalLinkHandler } from 'shared/routing'

export function openUrl(url) {
  window.SafariViewController.isAvailable(function(available) {
    if (available) {
      window.SafariViewController.show({
        url: url,
        hidden: false, // default false. You can use this to load cookies etc in the background (see issue #1 for details).
        animated: false, // default true, note that 'hide' will reuse this preference (the 'Done' button will always animate though)
        transition: 'curl', // (this only works in iOS 9.1/9.2 and lower) unless animated is false you can choose from: curl, flip, fade, slide (default)
        enterReaderModeIfAvailable: false, // default false
        tintColor: '#ffffff', // default is ios blue
        barColor: '#15202e', // on iOS 10+ you can change the background color as well
        controlTintColor: '#15202e' // on iOS 10+ you can override the default tintColor
      })
    } else {
      // potentially powered by InAppBrowser because that (currently) clobbers window.open
      createExternalLinkHandler(url)()
    }
  })
}

export function dismissBrowser() {
  window.SafariViewController.hide()
}
