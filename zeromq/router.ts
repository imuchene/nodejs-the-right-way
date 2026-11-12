import zmq from 'zeromq';

async function startServer() {
  const socket = new zmq.Router();

  // Bind to a local port
  await socket.bind('tcp://127.0.0.1:3000');
  console.log('Server listening on port 3000...');

  // todo

  // Handle incoming messages asynchronously
  for await (const [identity, delimiter, payload] of socket) {
    if (!identity || !payload || !delimiter) {
      continue;
    }
    const clientMsg = payload.toString();
    console.log(
      `Received message from [Client ID: ${identity.toString('hex')}]: ${clientMsg}`,
    );

    // Simulate an async task or quick processing
    setTimeout(async () => {
      const response = `Echo: ${clientMsg}`;

      // To reply via ROUTER, send back: [Identity, Delimiter, Payload]
      await socket.send([identity, delimiter, response]);
    }, 500);
  }
}

startServer().catch(console.error);
