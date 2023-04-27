// __mocks__/nats.ts
import { NatsConnection, Subscription } from 'nats';
import {ConnectFn} from "nats/lib/nats-base-client/types";

export const connect: ConnectFn = jest.fn();
export const credsAuthenticator = jest.fn();
export const jwtAuthenticator = jest.fn();

function createAsyncIterator() {
    return {
        next: jest.fn().mockResolvedValue({ value: undefined, done: true }),
    };
}

const mockSubscription: { isDraining: jest.Mock<any, any, any>; getSubject: jest.Mock<any, any, any>; getReceived: jest.Mock<any, any, any>; iterator: { next: jest.Mock<any, any, any> }; isClosed: jest.Mock<any, any, any>; getProcessed: jest.Mock<any, any, any>; unsubscribe: jest.Mock<any, any, any>; getMax: jest.Mock<any, any, any>; callback: jest.Mock<any, any, any>; getID: jest.Mock<any, any, any>; getPending: jest.Mock<any, any, any>; drain: jest.Mock<any, any, any> } = {
    iterator: createAsyncIterator(),
    unsubscribe: jest.fn(),
    drain: jest.fn(),
    isDraining: jest.fn(),
    isClosed: jest.fn(),
    callback: jest.fn(),
    getSubject: jest.fn(),
    getReceived: jest.fn(),
    getProcessed: jest.fn(),
    getPending: jest.fn(),
    getID: jest.fn(),
    getMax: jest.fn(),
};

const mockNatsConnection = {
    info: undefined,
    closed: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
    publish: jest.fn(),
    subscribe: jest.fn(() => mockSubscription),
    request: jest.fn(),
    requestMany: jest.fn(),
    flush: jest.fn().mockResolvedValue(undefined),
    drain: jest.fn().mockResolvedValue(undefined),
    isClosed: jest.fn(),
    isDraining: jest.fn(),
    getServer: jest.fn(),
    status: jest.fn(),
    stats: jest.fn(),
    jetstreamManager: jest.fn(),
    jetstream: jest.fn(),
    rtt: jest.fn().mockResolvedValue(0),
    services: jest.fn(),
} as unknown as NatsConnection;


(connect as jest.Mock).mockResolvedValue(mockNatsConnection);
