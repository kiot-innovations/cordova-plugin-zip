export const toggleRoute = (path, history) => () =>
  history.location.pathname === path ? history.goBack() : history.push(path)

export const createExternalLinkHandler = url => event => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  window.open(url, '_system')
}
