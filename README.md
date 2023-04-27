# Syntropy PubSub-JS

`syntropy-pubsub-js` is a TypeScript library for the Syntropy DataMesh project that allows you to subscribe to existing data streams or publish new ones. This library is built on top of the NATS messaging system and provides a convenient way to integrate your TypeScript applications with the Syntropy DataMesh platform.

## Features

- Subscribe to existing data streams
- Publish new data streams
- Support for JSON messages
- Customizable connection options

## Installation

To install the library, use the following command:

```bash
npm install --save syntropy-pubsub-js
```

## Usage
Here is a simple example demonstrating how to subscribe to a data stream and republish the received data to another stream:

```typescript
import { NatsService } from '../pubsub/nats';

const natsUrl = 'nats://127.0.0.1';
const userCredsJWT = 'JWT';
const userCredsSeed = 'SEED';
const exampleSubscribeSubject = 'example.sub.subject';
const examplePublishSubject = 'example.pub.subject';

async function republishData(service: NatsService, data: Uint8Array): Promise<void> {
    console.log(`Received message on ${exampleSubscribeSubject} subject`);
    await service.publish(examplePublishSubject, data);
    console.log(`Published message on ${examplePublishSubject} subject`);
}

async function main() {
    // Connect to the NATS server with credentials
    const service = new NatsService({
        url: natsUrl,
        userCredsJWT: userCredsJWT,
        userCredsSeed: userCredsSeed,
    });

    console.log('Connecting to NATS server...');
    await service.waitForConnection();
    console.log('Connected to NATS server.');

    // Add a handler function to process messages received on the exampleSubscribeSubject
    service.addHandler(exampleSubscribeSubject, async (data: Uint8Array) => {
        await republishData(service, data);
    });

    // Start serving messages and processing them using the registered handler function
    await service.serve();
}

main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
```

This example demonstrates how to connect to a NATS server with WebSocket support, subscribe to a subject, and republish received messages to another subject using the Syntropy PubSub-WS library.

## License
This project is licensed under the MIT License.