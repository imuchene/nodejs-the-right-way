import * as zmq from 'zeromq';

// Create a request endpoint
const requester = new zmq.Request();
requester.connect('tcp://localhost:5555');

const filename = process.argv[2];
// Send a request for content
console.log(`Sending a request for ${filename}`);
console.log('filename', filename);
await requester.send(String(filename));

const [result] = await requester.receive();

if (result) {
  const response = result.toString();
  console.log('Received response:', response);
}

requester.close();
