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
npm install git@gitlab.com:syntropynet/amberdm/sdk/pubsub-js.git
```

## Usage
Here is a simple example demonstrating how to subscribe to a data stream using seed from developer-portal:

```typescript
import { NatsService, createAppJwt } from 'pubsub-js';

const natsUrl = "url-to-nats.com";
const subject = "hackathon.mysubject";
const dappAccessToken = `SAAGYGEENOBBBBSPZDVVVYEUV3R4LAAAIEYVJOYXMWYJD6YQ5N3LVMQSA4`;

async function printData(data: Uint8Array): Promise<void> {
    const decoded = new TextDecoder().decode(data);
    console.log(`Received message on ${subject} subject. Message: ${decoded}`);
}

async function main() {
    // Connect to the NATS server with credentials
    const service = new NatsService({
        url: natsUrl,
        natsCredsFile: createAppJwt(dappAccessToken),
    });

    console.log("Connecting to NATS server...");
    await service.waitForConnection();
    console.log("Connected to NATS server.");

    // Add a handler function to process messages received on the exampleSubscribeSubject
    console.log(`Listening for ${subject} messages...`)
    service.addHandler(subject, async (data: Uint8Array) => {
        await printData(data);
    });

    // Start serving messages and processing them using the registered handler function
    await service.serve();
}

main().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
});
```

This example demonstrates how to connect to a NATS server with WebSocket support, subscribe to a subject, and republish received messages to another subject using the Syntropy PubSub-WS library.

## License
This project is licensed under the MIT License.