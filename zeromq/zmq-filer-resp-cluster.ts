import * as cluster from 'cluster';
import * as fs from 'fs';
import * as zmq from 'zeromq';
import * as os from 'os';

const numWorkers = os.cpus().length;

if (cluster.isPrimary) {
  // Master process creates ROUTER and DEALER sockets and binds endpoints
  const router = new zmq.Router().bind('tcp://127.0.0.1:60401');
  const dealer = new zmq.Dealer().bind('ipc://filer-dealer.ipc');

  // Forward messages between the router and the dealer
  // todo

  // Fork a worker process for each CPU
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }
} else {
  const responder = new zmq.Reply();
  await responder.bind('ipc://filer-dealer.ipc');
  console.log('Listening for zmq requesters...');

  // Handle incoming requests
  for await (const [data] of responder) {
    // Parse the incoming message
    if (!data) {
      continue;
    }

    const request = data.toString();
    console.log(`Received request to get: ${request}`);

    // Read the file and reply with content
    fs.readFile(request, async (error, content) => {
      console.log('Sending response content');
      await responder.send(
        JSON.stringify({
          content: content.toString(),
          timestamp: Date.now(),
          pid: process.pid,
        }),
      );
    });
  }
}
