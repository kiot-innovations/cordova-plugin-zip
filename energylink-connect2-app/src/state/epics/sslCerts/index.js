import {
  checkSSLCertsEpic,
  checkSSLCertsErrorEpic,
  checkSSLCertsSuccessEpic
} from './checkSSLCerts'

export default [
  checkSSLCertsEpic,
  checkSSLCertsErrorEpic,
  checkSSLCertsSuccessEpic
]
