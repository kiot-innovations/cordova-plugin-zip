import { last, match } from 'ramda'

export function getVersionFromUrl(url) {
  return last(match(/[0-9.]*[0-9]/g, url))
}
