#!/usr/bin/env node

'use strict'

const spawn = require('cross-spawn')
const script = process.argv[2]
const args = process.argv.slice(3)

switch (script) {
  case 'environments':
  case 'deploy': {
    const result = spawn.sync(
      'node',
      [require.resolve(`../dist/${script}`)].concat(args),
      { stdio: 'inherit' }
    )
    if (result.signal) {
      if (result.signal === 'SIGKILL') {
        console.log(
          'The process exited too early. ' +
            'This probably means the system ran out of memory or someone called ' +
            '`kill -9` on the process.'
        )
      } else if (result.signal === 'SIGTERM') {
        console.log(
          'The process exited too early. ' +
            'Someone might have called `kill` or `killall`, or the system could ' +
            'be shutting down.'
        )
      }
      process.exit(1)
    }
    process.exit(result.status)
  }
  default:
    console.log('Unknown command "' + script + '".')
    break
}
