const minimist = require('minimist')

module.exports = () => {
  const args = minimist(process.argv.slice(2))
  let cmd = args._[0] || 'help'

  if (args.help || args.h) {
    cmd = 'help'
  }

  switch (cmd) {
    case 'help':
      require('./help.js')(args)
      break

    case 'add':
      require('./parsemd')(args)
      break

    default:
      console.error(`"${args._.join(' ')}"`, 'are not valid commands')
      break
  }
}
