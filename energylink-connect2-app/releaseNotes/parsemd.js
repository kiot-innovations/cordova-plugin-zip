const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const ora = require('ora')
const matchAll = require('string.prototype.matchall')

module.exports = async args => {
  const {
    notes = 'doc/notes.md',
    target = '../src/pages/VersionInformation/releaseNotes.json',
    version,
    date
  } = args

  if (!date) {
    ora().fail('Release date must be provided using the --date flag.')
    process.exit(1)
  }

  if (!version) {
    ora().fail('Version must be provided using the --version flag.')
    process.exit(1)
  }

  const spinner = ora(
    `Using ${notes} file to generate the version information data`
  ).start()

  await wait(3)

  console.info('')
  console.info('--------------------------------------------------')
  console.info('Generating new release notes JSON at the location:')
  console.info(target)
  console.info('> markdown file', notes)
  console.info('> version', version)
  console.info('> date', date)

  await wait(3)

  try {
    const folder = notes.split('/')[0]

    const md = fs.readFileSync(notes, { encoding: 'UTF-8' })
    const images = extractImagePlaceholders(md)
    const imagesInBase64 = images
      .map(getBase64ImagesFromFiles(folder))
      .filter(Boolean)

    // this is the final markdown
    let output = md

    imagesInBase64.forEach(image => {
      output = output.replace(image.name, `![${image.name}](${image.value})`)
    })

    fs.writeFileSync(path.join(folder, `${version}.md`), output, {
      encoding: 'UTF-8'
    })

    const json = {
      versionNumber: version,
      releaseDate: date,
      bodyMarkdown: output
    }

    const releaseNotesString = fs.readFileSync(target)
    const releaseNotesJson = JSON.parse(releaseNotesString)
    releaseNotesJson.versions.unshift(json)

    const rn = JSON.stringify(releaseNotesJson)
    fs.writeFileSync(target, rn)

    const nice = spawn('npx', ['prettier', target, '--write'])

    nice.on('close', code => {
      if (code !== 0) {
        spinner.fail(
          'Error beautifying JSON. An unexpected error happened with prettier'
        )
      }
      spinner.succeed(
        `Generation complete. ${target} file successfully updated`
      )
      process.exit(0)
    })
  } catch (e) {
    spinner.fail(`An unexpected error happened: ${e.message}`)
    console.error(e.stackTrace)
    process.exit(1)
  }
}

const extractImagePlaceholders = md => {
  const rx = /\d+\.(?:png|jpg|jpeg|gif)/g
  const matches = [...matchAll(md, rx)]
  return flatMatches(matches)
}

const flatMatches = matches => matches.map(m => m[0])

const getBase64ImagesFromFiles = folder => name => {
  const value = imageFileToBase64(name, folder)
  return value ? { name, value } : null
}

const imageFileToBase64 = (imageName, folder) => {
  const pathimage = path.join(folder, imageName)
  try {
    const bufferImage = fs.readFileSync(pathimage)
    const b64 = bufferImage.toString('base64')
    return `data:image/png;base64,${b64}`
  } catch (e) {
    console.warn(
      'Error converting',
      imageName,
      'does it exist at',
      pathimage,
      '?'
    )
    return null
  }
}

const wait = (seconds = 5) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, seconds * 1000)
  })
