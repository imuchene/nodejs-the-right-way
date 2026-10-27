import * as fs from 'fs'

fs.createReadStream(String(process.argv[2])).on('data', chunk => process.stdout.write(chunk)).on('error', err => process.stderr.write(`ERROR: ${err.message}\n`))