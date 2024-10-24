"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsService = void 0;
const nats_1 = require("nats");
class NatsService {
    // Initialize the NatsService with the provided configuration
    constructor(config) {
        this.config = config;
        this.handlers = new Map();
        this.subscriptions = [];
        this.connectionPromise = this.initConnection();
    }
    // Initialize the connection to the NATS server
    initConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const authenticator = this.getAuthenticator(this.config);
            if (!authenticator) {
                throw new Error("No credentials provided.");
            }
            this.nats = yield (0, nats_1.connect)({
                servers: this.config.url,
                authenticator: authenticator,
            });
        });
    }
    waitForConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectionPromise;
        });
    }
    // Determine the appropriate authenticator based on the provided configuration
    getAuthenticator(config) {
        if (config.userCredsJWT && config.userCredsSeed) {
            return (0, nats_1.jwtAuthenticator)(config.userCredsJWT, new TextEncoder().encode(config.userCredsSeed));
        }
        else if (config.natsCredsFile) {
            return (0, nats_1.credsAuthenticator)(new TextEncoder().encode(config.natsCredsFile));
        }
        else {
            return undefined;
        }
    }
    // Add a handler for a specific subject
    addHandler(subject, handler) {
        if (this.handlers.has(subject)) {
            throw new Error(`Handler for subject "${subject}" already exists.`);
        }
        this.handlers.set(subject, handler);
    }
    // Serve the handlers by creating subscriptions for each subject
    serve() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.nats) {
                throw new Error("NATS connection not initialized");
            }
            for (const [subject, handler] of this.handlers.entries()) {
                const subscription = this.nats.subscribe(subject, {
                    callback: (err, msg) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            console.error("Error in subscription:", err);
                            return;
                        }
                        yield handler(msg.data);
                    }),
                });
                this.subscriptions.push(subscription);
            }
        });
    }
    // Close the connection to the NATS server
    close() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.nats) === null || _a === void 0 ? void 0 : _a.close());
        });
    }
    // Publish data to a specific subject
    publish(subject, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.nats) {
                throw new Error("NATS connection not initialized");
            }
            yield this.nats.publish(subject, data);
        });
    }
    // Publish a request expecting response back
    request(subject, data, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.nats) {
                throw new Error("NATS connection not initialized");
            }
            yield this.nats.request(subject, data, opts);
        });
    }
    // Publish JSON data to a specific subject
    publishJSON(subject, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const jsonData = new TextEncoder().encode(JSON.stringify(data));
            yield this.publish(subject, jsonData);
        });
    }
}
exports.NatsService = NatsService;
//# sourceMappingURL=nats.js.map