import { pathOr } from 'ramda'
import { useSelector } from 'react-redux'

const useSiteKey = () => useSelector(pathOr('', ['site', 'site', 'siteKey']))

export default useSiteKey
