import * as fs from 'fs';
import * as net from 'net';

const filename: string | undefined = process.argv[2];

if (!filename) {
  throw Error('Error: No filename specified');
}

net
  .createServer((connection: net.Socket) => {
    // Reporting
    console.log('Subscriber connected');
    connection.write(JSON.stringify({ type: 'watching', file: filename}) + '\n')

    // Watcher setup
    const watcher = fs.watch(filename, () =>
      connection.write(JSON.stringify({ tyoe: 'changed', timestamp: Date.now()}) + '\n'),
    );

    // Cleanup
    connection.on('close', () => {
      console.log('Subscriber disconnected');
      watcher.close();
    });
  })
  .listen('/tmp/watcher.sock', () => console.log('Listening for subscribers...'));
