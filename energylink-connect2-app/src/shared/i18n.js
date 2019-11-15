import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import * as languages from './locales'

const getTranslate = translations => (key, ...params) => {
  let value = translations[key] || key
  if (params) {
    params.forEach((p, idx) => {
      value = value.replace(`{${idx}}`, p)
    })
  }
  return value
}

export const useI18n = () => {
  const language = useSelector(state => state.language)
  const { locale = 'en' } = language
  return useMemo(() => getTranslate(languages[locale]), [locale])
}
