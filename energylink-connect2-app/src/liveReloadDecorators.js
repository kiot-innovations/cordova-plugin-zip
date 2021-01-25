export default function addProxyDecorator(proxyAddress) {
  const exceptions = [
    /sentry\.io/,
    /google-analytics/,
    /mixpanel\.com/,
    /:4000/,
    /:3000/,
    /hot-update/
  ]
  const origFetch = fetch
  const origOpen = XMLHttpRequest.prototype.open
  window.fetch = (url, ...args) => {
    const updatedUrl = exceptions.find(re => url.match(re))
      ? url
      : proxyAddress + url
    return origFetch.apply(window, [updatedUrl, ...args])
  }

  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    const updatedUrl = exceptions.find(re => url.match(re))
      ? url
      : proxyAddress + url
    return origOpen.apply(this, [method, updatedUrl, ...args])
  }
}
