import * as zmq from 'zeromq';
import * as chokidar from 'chokidar';

const filename = process.argv[2];
const sock = new zmq.Publisher();

await sock.bind('tcp://*:5555');

const watcher = chokidar.watch(String(filename), {
  persistent: true,
  ignoreInitial: true,
});

watcher.on('all', async (event, path) => {
  const payload = JSON.stringify({ event, path, timestamp: Date.now() });
  console.log(`[Chokidar] ${event}: ${path} -> Broadcasting via ZeroMQ`);
  await sock.send(['file-events', payload]);
});

console.log('Listening for zmq subscribers...');
