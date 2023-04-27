import {
    connect,
    NatsConnection,
    Subscription,
    credsAuthenticator,
    jwtAuthenticator,
} from "nats";

// Define a handler type that processes Uint8Array data and returns a Promise or void
export type Handler = (data: Uint8Array) => Promise<void> | void;

// Define a configuration interface for initializing the NatsService
export interface Config {
    url?: string;
    userCredsJWT?: string;
    userCredsSeed?: string;
    natsCredsFile?: string;
}

export class NatsService {
    private nats?: NatsConnection;
    private handlers: Map<string, Handler> = new Map();
    private subscriptions: Subscription[] = [];

    private connectionPromise: Promise<void>;

    // Initialize the NatsService with the provided configuration
    constructor(private config: Config) {
        this.connectionPromise = this.initConnection();
    }

    // Initialize the connection to the NATS server
    private async initConnection(): Promise<void> {
        const authenticator = this.getAuthenticator(this.config);
        if (!authenticator) {
            throw new Error("No credentials provided.");
        }

        this.nats = await connect({
            servers: this.config.url,
            authenticator: authenticator,
        });
    }

    public async waitForConnection(): Promise<void> {
        await this.connectionPromise;
    }

    // Determine the appropriate authenticator based on the provided configuration
    private getAuthenticator(config: Config) {
        if (config.userCredsJWT && config.userCredsSeed) {
            return jwtAuthenticator(
                config.userCredsJWT,
                new TextEncoder().encode(config.userCredsSeed)
            );
        } else if (config.natsCredsFile) {
            return credsAuthenticator(new TextEncoder().encode(config.natsCredsFile));
        } else {
            return undefined;
        }
    }

    // Add a handler for a specific subject
    public addHandler(subject: string, handler: Handler): void {
        if (this.handlers.has(subject)) {
            throw new Error(`Handler for subject "${subject}" already exists.`);
        }
        this.handlers.set(subject, handler);
    }

    // Serve the handlers by creating subscriptions for each subject
    public async serve(): Promise<void> {
        if (!this.nats) {
            throw new Error("NATS connection not initialized");
        }

        for (const [subject, handler] of this.handlers.entries()) {
            const subscription = this.nats.subscribe(subject, {
                callback: async (err, msg) => {
                    if (err) {
                        console.error("Error in subscription:", err);
                        return;
                    }
                    await handler(msg.data);
                },
            });
            this.subscriptions.push(subscription);
        }
    }

    // Close the connection to the NATS server
    public async close(): Promise<void> {
        await this.nats?.close();
    }

    // Publish data to a specific subject
    public async publish(subject: string, data: Uint8Array): Promise<void> {
        if (!this.nats) {
            throw new Error("NATS connection not initialized");
        }
        await this.nats.publish(subject, data);
    }

    // Publish JSON data to a specific subject
    public async publishJSON(subject: string, data: any): Promise<void> {
        const jsonData = new TextEncoder().encode(JSON.stringify(data));
        await this.publish(subject, jsonData);
    }
}
