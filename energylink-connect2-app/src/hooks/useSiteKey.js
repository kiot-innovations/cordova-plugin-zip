import { useSelector } from 'react-redux'
import { pathOr } from 'ramda'

const useSiteKey = () => useSelector(pathOr('', ['site', 'site', 'siteKey']))

export default useSiteKey
