// Tweak these for best failure retry intervalsb6
const maxRetries = 10
const retryTimeoutTime = 1000 //milliseconds

// Multiple fingerprints are allowed here because we might
// eventually need to specify multiple fingerprints as people's
// certs update. Only a single fingerprint is required.

let checks = [
  {
    description: 'SunPower EDP API (Production)',
    server: 'https://edp-api.edp.sunpower.com/',
    fingerprints: [
      'AF E5 7B A8 56 F8 B6 37 54 07 4A CC F6 81 F3 4E 5A 4D 98 D6 9A A1 5A 0C E5 A5 1A D6 77 CC 56 B6'
    ]
  },
  {
    description: 'Mixpanel',
    server: 'https://api-js.mixpanel.com/',
    fingerprints: [
      'C5 57 61 E3 D0 AD 77 C9 6E 8B 07 5B D9 2E 8A B0 FC 36 CA 4D 25 85 A4 E9 0A 52 68 C4 93 09 08 4E'
    ]
  },
  {
    //retrieve the fingerprint from here https://www.google-analytics.com/analytics.js
    description: 'Google Analytics',
    server: 'https://www.google-analytics.com/',
    fingerprints: [
      '1C 55 65 93 E8 99 C4 6C 4E 04 07 AB 0B 4A 9B 1D DC 9F 13 F2 83 B5 9B 63 1F 0A B1 E8 75 9E FF 5B'
    ]
  },
  {
    description: 'Sentry',
    server: 'https://o352402.ingest.sentry.io/',
    fingerprints: [
      '4C 84 35 68 90 51 45 25 3E B1 D2 1D 4B 17 ED E7 B5 31 D4 14 54 86 68 95 5F 05 83 5C CD 0F 7A 78'
    ]
  },
  {
    description: 'Google Maps API',
    server: 'https://maps.googleapis.com/',
    fingerprints: [
      '05 50 68 55 E0 E4 74 C8 2C 1C 6B 82 DA E2 32 79 BF 72 7D 58 40 A4 C5 A8 C4 9E 84 74 59 F8 B9 F0'
    ]
  },
  {
    description: 'Amazon AWS',
    server: 'https://s3-us-west-2.amazonaws.com/',
    fingerprints: [
      'AE A3 C0 2F 9F 6B FB 1B 50 97 AF 61 01 B4 13 F2 F4 71 08 28 79 6A 01 A3 DE 19 FF EA D6 13 05 AB'
    ]
  },
  {
    description: 'PING',
    server: 'https://federation.us.sunpower.com/',
    fingerprints: [
      '18 00 D4 2A 0B 60 36 63 8C 1A 66 62 D8 53 05 FA BB 9B 9C E0 95 24 77 8B DF AC 6A 2C D0 0B 90 84'
    ]
  },
  {
    description: 'Artifactory',
    server: 'https://prod-jfrog-artifactory-proxy-oauth2.p2e.io/',
    fingerprints: [
      '0E 7E 17 47 68 A4 3F B9 C2 A5 C7 94 AD 21 3E A5 B9 3D D5 45 C6 61 98 11 C7 78 C5 32 26 E8 79 14'
    ]
  }
]

const runCertCheck = (check, counter = 0) => {
  const sslCertificateCheckerCheckPromise = (server, fingerprints) =>
    new Promise((resolve, reject) => {
      window.plugins.sslCertificateChecker.check(
        message => {
          return resolve(message)
        },
        function error(err) {
          if (err === 'CONNECTION_NOT_SECURE') {
            return reject({ check, err })
          } else if (counter <= maxRetries) {
            setTimeout(async function() {
              const checkResult = await runCertCheck(check, ++counter).catch(
                reject
              )
              if (checkResult) return resolve()
            }, retryTimeoutTime)
          } else {
            return reject({ check, err })
          }
        },
        server,
        fingerprints
      )
    })
  return sslCertificateCheckerCheckPromise(check.server, check.fingerprints)
}

export const checkAllSSLCerts = () => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function(resolve, reject) {
    let passed
    try {
      const checkResults = await Promise.all(checks.map(runCertCheck))
      const isNotSecure = element => element !== 'CONNECTION_SECURE'
      passed = checkResults.find(isNotSecure) === undefined
      resolve(passed)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}
