import * as fs from 'fs';
import * as zmq from 'zeromq';

// Socket to reply to client requests
const responder = new zmq.Reply();

// Listen on port 60401
await responder.bind('tcp://*:5555');
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

// Close the responder when the Node process ends
process.on('SIGINT', () => {
  console.log('Shutting down...');
  responder.close();
});
