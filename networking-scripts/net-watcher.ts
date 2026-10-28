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
    connection.write(`Now watching ${filename} for changes...\n`);

    // Watcher setup
    const watcher = fs.watch(filename, () =>
      connection.write(`File changed: ${new Date()}\n`),
    );

    // Cleanup
    connection.on('close', () => {
      console.log('Subscriber disconnected');
      watcher.close();
    });
  })
  .listen(60300, () => console.log('Listening for subscribers...'));
