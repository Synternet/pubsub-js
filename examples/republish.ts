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
})