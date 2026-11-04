import * as zmq from 'zeromq';

// Socket to talk to server
const sock = new zmq.Subscriber();
sock.connect('tcp://localhost:5555');
sock.subscribe('file-events');

for await (const [topic, message] of sock) {
  if (topic && message) {
    const data = JSON.parse(message.toString());
    console.log(
      `[ZMQ Received] Topic: ${topic.toString()} | Event: ${data.event} | File: ${data.path} | Date: ${new Date(data.timestamp)}`,
    );
  }
}
