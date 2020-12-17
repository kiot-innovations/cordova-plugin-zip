import { useSelector } from 'react-redux'
import { pathOr } from 'ramda'

const useSiteChanged = () => useSelector(pathOr(false, ['site', 'siteChanged']))

export default useSiteChanged
