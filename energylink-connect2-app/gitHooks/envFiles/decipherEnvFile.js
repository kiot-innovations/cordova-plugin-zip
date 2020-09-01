// Based on https://stackoverflow.com/a/19939873
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const ALGORITHM = 'aes-256-cbc'

const readEnvFile = appEnv =>
  fs.readFileSync(path.join(__dirname, `../../.env.enc.${appEnv}`), 'ascii')

const md5 = data => {
  const hash = crypto.createHash('md5')
  hash.update(data)

  return Buffer.from(hash.digest('hex'), 'hex')
}

const decipherEnvFile = (decipherKey, appEnv) => {
  // File content is Base64 encoded after encryption with OpenSSL
  const base64EnvFile = readEnvFile(appEnv)
  // File content needs to be Base64 decoded before deciphering
  const cipheredEnvFile = Buffer.from(base64EnvFile, 'base64')

  // Derive ciphering params from ciphered content and decipher key
  const salt = cipheredEnvFile.slice(8, 16)
  const cipheredText = cipheredEnvFile.slice(16)
  const password = Buffer.from(decipherKey)

  const hash0 = Buffer.from('')
  const hash1 = md5(Buffer.concat([hash0, password, salt]))
  const hash2 = md5(Buffer.concat([hash1, password, salt]))
  const hash3 = md5(Buffer.concat([hash2, password, salt]))

  const key = Buffer.concat([hash1, hash2])
  const iv = hash3

  // Create a decipher with derived params
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

  const decipheredChunks = []
  decipheredChunks.push(decipher.update(cipheredText, 'binary', 'utf8'))
  decipheredChunks.push(decipher.final('utf8'))
  const plainText = decipheredChunks.join('')

  return plainText
}

exports.decipherEnvFile = decipherEnvFile
