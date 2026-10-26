import * as fs from 'fs';

// The line below will overwrite the target.txt file with the string
// 'hello world'
fs.writeFile('target.txt', 'hello world', (err: Error | null) => {
  if (err) {
    throw err;
  }

  console.log('File saved!');
})