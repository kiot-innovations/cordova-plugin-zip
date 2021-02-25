import { last, match, compose, replace } from 'ramda'

export function getVersionFromUrl(url) {
  return last(match(/[0-9.]*[0-9]/g, url))
}

export const getValidFileName = compose(replace(/\./g, '-'), getVersionFromUrl)
