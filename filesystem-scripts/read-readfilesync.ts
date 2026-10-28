import * as fs from 'fs';

const data = fs.readFileSync('target.txt');
process.stdout.write(data.toString());
