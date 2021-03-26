var xcode = require('xcode')
var fs = require('fs')
var path = require('path')

const xcodeProjPath = fromDir('platforms/ios', '.xcodeproj', false)
const projectPath = xcodeProjPath + '/project.pbxproj'
const myProj = xcode.project(projectPath)

myProj.parse(function(err) {
  if (err) {
    console.error('ERROR PARSING PROJECT')
    console.error(err)
    return
  }

  myProj.addToBuildSettings('VALIDATE_WORKSPACE', 'YES')

  fs.writeFileSync(projectPath, myProj.writeSync())
})

function fromDir(startPath, filter, rec, multiple) {
  if (!fs.existsSync(startPath)) {
    console.info('no dir ', startPath)
    return
  }
  const files = fs.readdirSync(startPath)
  var resultFiles = []
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i])
    var stat = fs.lstatSync(filename)
    if (stat.isDirectory() && rec) {
      fromDir(filename, filter) //recurse
    }

    if (filename.indexOf(filter) >= 0) {
      if (multiple) {
        resultFiles.push(filename)
      } else {
        return filename
      }
    }
  }
  if (multiple) {
    return resultFiles
  }
}
