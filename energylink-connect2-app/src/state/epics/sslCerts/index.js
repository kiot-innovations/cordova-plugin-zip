import {
  checkSSLCertsEpic,
  checkSSLCertsErrorEpic
} from './checkSSLCerts'

export default [
  checkSSLCertsEpic,
  checkSSLCertsErrorEpic
]
