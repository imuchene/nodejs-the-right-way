import * as fs from 'fs'
import * as childProcess from 'child_process';

const filename = process.argv[2]

if (!filename) {
  throw Error('A file to watch must be specified!')
}

fs.watch(filename, () => {
  const ls = childProcess.spawn('ls', ['-l', '-h', filename])
  ls.stdout.pipe(process.stdout)
})

console.log(`Now watching ${filename} for changes...`)