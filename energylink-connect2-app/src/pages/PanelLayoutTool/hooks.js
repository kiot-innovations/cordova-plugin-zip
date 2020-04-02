import { pathOr } from 'ramda'
import { useSelector } from 'react-redux'

export const useError = () => {
  const orientation = useSelector(
    pathOr([], ['panel_layout_tool', 'overlappingIds'])
  )
  return orientation.length ? 'OVERLAPPING_PANELS' : ''
}
