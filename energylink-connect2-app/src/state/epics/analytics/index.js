import { loginSuccessEpic, loginErrorEpic } from './loginEpics'
import { errorEpic } from './errorEpic'

export default [loginSuccessEpic, loginErrorEpic, errorEpic]
