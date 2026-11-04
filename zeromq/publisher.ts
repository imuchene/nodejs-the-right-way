// publisher.js
import chokidar from 'chokidar';
import * as zmq from 'zeromq';

const filename = process.argv[2];

async function startPublisher() {
  // 1. Initialize ZeroMQ Publisher Socket
  const sock = new zmq.Publisher();
  await sock.bind('tcp://127.0.0.1:3000');
  console.log('ZeroMQ Publisher bound to port 3000');

  // 2. Initialize Chokidar Watcher
  // Note: In Chokidar v4, chokidar.watch() returns a native-like async iterable or standard watcher
  const watcher = chokidar.watch(String(filename), {
    persistent: true,
    ignoreInitial: true, // Skip reporting files that already exist on startup
  });

  console.log('Watching "./watched-folder" for changes...');

  // 3. Broadcast events when files change
  watcher.on('all', async (event, path) => {
    const payload = JSON.stringify({ event, path, timestamp: Date.now() });

    console.log(`[Chokidar] ${event}: ${path} -> Broadcasting via ZeroMQ`);

    // Send using a topic (e.g., 'file-events') for subscribers to filter on
    await sock.send(['file-events', payload]);
  });
}

startPublisher().catch(console.error);
