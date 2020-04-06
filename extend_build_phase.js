var xcode = require('xcode')
var fs = require('fs')
var path = require('path')

const shellScript = fs.readFileSync('clean_arches.sh', 'utf-8')

const xcodeProjPath = fromDir('platforms/ios', '.xcodeproj', false)
const projectPath = xcodeProjPath + '/project.pbxproj'
const myProj = xcode.project(projectPath)
// Here you can add your own shellScript
var options = { shellPath: '/bin/sh', shellScript }

myProj.parse(function(err) {
  if (err) {
    console.error('ERROR PARSING PROJECT')
    console.error(err)
    return
  }

  myProj.addBuildPhase(
    [],
    'PBXShellScriptBuildPhase',
    'Run a script',
    myProj.getFirstTarget().uuid,
    options
  )
  fs.writeFileSync(projectPath, myProj.writeSync())
})

function fromDir(startPath, filter, rec, multiple) {
  if (!fs.existsSync(startPath)) {
    console.log('no dir ', startPath)
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
