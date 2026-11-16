import zmq from 'zeromq';

async function startClient() {
  const socket = new zmq.Dealer();

  // Optional: Set a readable custom identity before connecting
  socket.routingId = 'Client-Alpha';

  socket.connect('tcp://127.0.0.1:3000');
  console.log('Connected to server.');

  // 1. Asynchronously listen for responses
  // Use a separate IIFE loop so receiving doesn't block outgoing sends
  (async () => {
    for await (const [delimiter, payload] of socket) {

      if (!payload || !delimiter) {
        continue;
      }

      console.log(`Received from server: ${payload.toString()}`);
    }
  })();

  // 2. Blast out multiple requests continuously without waiting
  for (let i = 1; i <= 5; i++) {
    console.log(`Sending job #${i}`);

    // Structure: [Empty Delimiter Frame, Message Payload]
    await socket.send([null, `Job Data #${i}`]);

    // Quick pause before sending the next one
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

startClient().catch(console.error);
