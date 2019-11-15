export const toggleRoute = (path, history) => () =>
  history.location.pathname === path ? history.goBack() : history.push(path)
