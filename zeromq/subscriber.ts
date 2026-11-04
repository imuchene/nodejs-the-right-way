// subscriber.js
import * as zmq from 'zeromq';

async function startSubscriber() {
  // 1. Initialize ZeroMQ Subscriber Socket
  const sock = new zmq.Subscriber();
  sock.connect('tcp://127.0.0.1:3000');

  // 2. Subscribe to the specific topic
  sock.subscribe('file-events');
  console.log('ZeroMQ Subscriber connected and listening for "file-events"...');

  // 3. Handle incoming messages using an async loop
  for await (const [topic, message] of sock) {
    if (message && topic) {
      const data = JSON.parse(message.toString());
      console.log(
        `[ZMQ Received] Topic: ${topic.toString()} | Event: ${data.event} | File: ${data.path}`,
      );
    }
  }
}

startSubscriber().catch(console.error);
