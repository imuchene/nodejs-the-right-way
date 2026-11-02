import * as fs from 'fs';
import amqplib from 'amqplib';

const filename = process.argv[2];

const connection = await amqplib.connect('amqp://localhost');
const channel = await connection.createChannel();

const queue = 'hello';
const message = {
  type: 'changed',
  file: filename,
  timestamp: Date.now(),
};

fs.watch(String(filename), async () => {
  await channel.assertQueue(queue, {
    durable: true,
    arguments: {
      'x-queue-type': 'quorum',
    },
  });

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  console.log(' [x] Send %s', message);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});
