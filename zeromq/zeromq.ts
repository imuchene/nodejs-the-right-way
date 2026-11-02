import * as zmq from 'zeromq';

async function runServer() {
  const sock = new zmq.Reply();

  await sock.bind('tcp://*:5555');

  for await (const [msg] of sock) {
    console.log('Received ' + ': [' + msg?.toString() + ']');
    await sock.send('World');
  }
}

runServer();

async function runClient() {
  console.log('Connecting to hello world server...');

  // Socket to talk to server
  const sock = new zmq.Request();
  sock.connect('tcp://localhost:5555');

  for (let i = 0; i < 10; i++) {
    console.log('Sending Hello', i);
    await sock.send('Hello');
    const [result] = await sock.receive();
    console.log('Received ', result?.toString(), i);
  }
}

runClient();
