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
      'AF E5 7B A8 56 F8 B6 37 54 07 4A CC F6 81 F3 4E 5A 4D 98 D6 9A A1 5A 0C E5 A5 1A D6 77 CC 56 B6',
    ],
  },
  {
    description: 'Mixpanel',
    server: 'https://api-js.mixpanel.com/',
    fingerprints: [
      'C5 57 61 E3 D0 AD 77 C9 6E 8B 07 5B D9 2E 8A B0 FC 36 CA 4D 25 85 A4 E9 0A 52 68 C4 93 09 08 4E',
    ],
  },
  {
    description: 'Google Analytics',
    server: 'https://www.google-analytics.com/',
    fingerprints: [
      'D0 3E 43 61 C1 4B 24 CA BE DC 8C 4B 1D 87 51 F4 D6 31 50 DB E9 D1 54 90 45 BE 47 16 1E C4 2E 7C',
    ],
  },
  {
    description: 'Sentry',
    server: 'https://o352402.ingest.sentry.io/',
    fingerprints: [
      '4C 84 35 68 90 51 45 25 3E B1 D2 1D 4B 17 ED E7 B5 31 D4 14 54 86 68 95 5F 05 83 5C CD 0F 7A 78',
    ],
  },
  {
    description: 'Google Maps API',
    server: 'https://maps.googleapis.com/',
    fingerprints: [
      '10 F5 18 67 BB 28 10 94 5F 08 49 5B B1 0B D0 8B E5 42 0B 71 30 C5 6D B4 48 A7 D4 84 48 49 04 B7',
    ],
  },
  {
    description: 'Jfrog',
    server: 'https://prod-jfrog-artifactory-proxy-oauth2.p2e.io/',
    fingerprints: [
      'B9 4C 4B 0A 43 D3 18 6F D6 41 CD A2 96 04 C6 0D 8F C5 85 16 54 B7 1D AD F3 97 0C 22 7A E5 A7 F7',
    ],
  },
  {
    description: 'Amazon AWS',
    server: 'https://s3-us-west-2.amazonaws.com/',
    fingerprints: [
      'AE A3 C0 2F 9F 6B FB 1B 50 97 AF 61 01 B4 13 F2 F4 71 08 28 79 6A 01 A3 DE 19 FF EA D6 13 05 AB',
    ],
  },
  {
    description: 'PING',
    server: 'https://federation.us.sunpower.com/',
    fingerprints: [
      '18 00 D4 2A 0B 60 36 63 8C 1A 66 62 D8 53 05 FA BB 9B 9C E0 95 24 77 8B DF AC 6A 2C D0 0B 90 84',
    ],
  },
]

const runCertCheck = (check, counter = 0) => {
  const sslCertificateCheckerCheckPromise = (server, fingerprints) =>
    new Promise((resolve, reject) => {
      window.plugins.sslCertificateChecker.check(
        (message) => {
          return resolve(message)
        },
        function error(err) {
          if (err === 'CONNECTION_NOT_SECURE') {
            return reject({ check, err })
          } else if (counter <= maxRetries) {
            setTimeout(async function () {
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
  return new Promise(async function (resolve, reject) {
    let passed
    try {
      const checkResults = await Promise.all(checks.map(runCertCheck))
      const isSecure = (element) => element !== 'CONNECTION_SECURE'
      passed = checkResults.find(isSecure) === undefined
      resolve(passed)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}
