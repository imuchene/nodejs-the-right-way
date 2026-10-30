import * as assert from 'assert';
import EventEmitter from 'events';
import { LDJClient } from '../networking-scripts/ldj-client';

describe('LDJClient Test', () => {
  let stream: any = null;
  let client: any = null;

  beforeEach(() => {
    stream = new EventEmitter();
    client = new LDJClient(stream);
  });

  it('should emit a message event from a single data event', (done) => {
    client.on('message', (message: any) => {
      assert.deepEqual(message, { foo: 'bar' });
      done();
    });
    stream.emit('data', '{"foo": "bar"}\n');
  });

  it('should emit a message event from a split data events', (done) => {
    client.on('message', (message: any) => {
      assert.deepEqual(message, { foo: 'bar' });
      done();
    });
    stream.emit('data', '{"foo":');
    process.nextTick(() => stream.emit('data', '"bar"}\n'));
  });
});
