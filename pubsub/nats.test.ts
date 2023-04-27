import { NatsService, Config } from './nats';
import { connect } from 'nats';

jest.mock('nats');

const testSubject = 'test.subject';

describe('NatsService with mocked NATS server', () => {
    let service: NatsService;

    beforeEach(() => {
        (connect as jest.Mock).mockClear();
    });



    it('should handle message', async () => {
        const config: Config = {
            url: 'nats://mocked.url',
            userCredsJWT: "jwt",
            userCredsSeed: "ZXAAUKOBEGTZM2S6WV2HJBA6DB2CD5ACOJCKZPK2RXSGKBKWYQPFA2YSHY",
        };
        service = new NatsService(config);
        await service.waitForConnection();

        const handlerCalled = new Promise<void>((resolve) => {
            service.addHandler(testSubject, (data: Uint8Array) => {
                resolve();
            });
        });

        await service.serve();

        const client = await connect({ servers: 'nats://mocked.url' });
        await client.publish(testSubject, new TextEncoder().encode('test message'));

        await handlerCalled;

        await service.close();
        await client.close();
    });
});