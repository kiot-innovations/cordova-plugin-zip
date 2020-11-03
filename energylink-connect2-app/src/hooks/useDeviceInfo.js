import { pathEq } from 'ramda'

const useIsIos = () => pathEq(['device', 'platform'], 'iOS', window)
export default useIsIos
