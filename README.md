# Synternet PubSub-JS

Welcome to the documentation for the JavaScript SDK for the Data Layer by Synternet! This SDK allows seamless integration with our Data Layer solution, enabling you to leverage real-time data streams in your JavaScript applications. With the JavaScript SDK, you can unlock the power of the Data Layer and harness real-time insights for your data-driven projects.

[synternet-pubsub-js](https://github.com/Synternet/pubsub-js) is a TypeScript library for the Synternet Data Layer project that allows you to subscribe to existing data streams or publish new ones. This library is built on top of the NATS messaging system and provides a convenient way to integrate your TypeScript applications with the Synternet Data Layer platform.

## Installation

To use the JavaScript SDK for Data Layer in your project, you can include the provided script in your HTML:

```html
<script src="path/to/pubsub-js.js"></script>
```

## Getting Started

Before you begin using the JavaScript SDK, make sure you have the necessary credentials and access tokens from the [portal (mainnet)](https://portal.synternet.com/) or [portal (testnet)](https://portal-testnet.synternet.com/) platform. These credentials will allow you to connect to the Data Layer and subscribe to or publish data streams.

## Usage
The preferred method of authentication is using an access token from the [portal (mainnet)](https://portal.synternet.com/) or [portal (testnet)](https://portal-testnet.synternet.com/).

```JavaScript
import { NatsService } from "../pubsub/nats";
import { createAppJwt } from "../pubsub/userJwt";

// See: https://docs-dev.synternet.com/build/dl-access-points
const natsUrl = "url-to-nats.com";
const subject = "hackathon.mysubject";
const accessToken = `EXAMPLE_ACCESS_TOKEN`;

async function printData(data: Uint8Array): Promise<void> {
    const decoded = new TextDecoder().decode(data);
    console.log(`Received message on ${subject} subject. Message: ${decoded}`);
}

async function main() {
    // Connect to the NATS server with credentials
    const service = new NatsService({
        url: natsUrl,
        natsCredsFile: createAppJwt(accessToken),
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

## Features

The JavaScript SDK for Data Layer offers the following features:

- **Subscribe to Existing Data Streams**: Easily subscribe to pre-existing data streams within the Synternet Data Layer. Stay updated with real-time data insights and leverage them in your JavaScript applications.

- **Publish New Data Streams**: Create and publish your own data streams directly from your applications. Share data with other participants in the Data Layer, enabling collaboration and innovation.

- **Support for JSON Messages**: Communicate with the Data Layer using JSON messages. JSON provides a flexible and widely supported format for data exchange, allowing you to structure your data effectively.

- **Customizable Connection Options**: Tailor the connection settings based on your specific requirements. Customize connection timeouts, retry mechanisms, authentication methods, and more to ensure optimal performance and security.

With these powerful features, the JavaScript SDK empowers you to seamlessly interact with the Data Layer, unlocking the potential of real-time data streams for your applications.

## Examples

For detailed usage examples, please refer to the [examples directory](https://github.com/Synternet/pubsub-js/examples) in the repository. These examples cover various scenarios and demonstrate how to utilize the SDK's features effectively.

Here is a simple example demonstrating how to subscribe to a data stream using seed from [portal (mainnet)](https://portal.synternet.com/) or [portal (testnet)](https://portal-testnet.synternet.com/) (the preferred method of authentication is using an access token):

```JavaScript
import { NatsService } from "../pubsub/nats";
import { createAppJwt } from "../pubsub/userJwt";

// See: https://docs-dev.synternet.com/build/dl-access-points
const natsUrl = "url-to-nats.com";
const subject = "example.mysubject";
const accessToken = `EXAMPLE_ACCESS_TOKEN`;

async function printData(data: Uint8Array): Promise<void> {
    const decoded = new TextDecoder().decode(data);
    console.log(`Received message on ${subject} subject. Message: ${decoded}`);
}

async function main() {
    // Connect to the NATS server with credentials
    const service = new NatsService({
        url: natsUrl,
        natsCredsFile: createAppJwt(accessToken),
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

## Contributing

We welcome contributions from the community! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the [GitHub repository](https://github.com/Synternet/pubsub-js). We appreciate your feedback and collaboration in making this SDK even better.

## Contribution Guidelines

To contribute to this project, please follow the guidelines outlined in the [Contribution.md](CONTRIBUTING.md) file. It covers important information about how to submit bug reports, suggest new features, and submit pull requests.

## Code of Conduct
This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming and inclusive environment for all contributors. Please review the guidelines and make sure to follow them in all interactions within the project.

## Commit Message Format
When making changes to the codebase, it's important to follow a consistent commit message format. Please refer to the [Commit Message Format](commit-template.md) for details on how to structure your commit messages.

## Pull Request Template
To streamline the pull request process, we have provided a [Pull Request Template](pull-request-template.md) that includes the necessary sections for describing your changes, related issues, proposed changes, and any additional information. Make sure to fill out the template when submitting a pull request.

We appreciate your contributions and thank you for your support in making this project better!

## Support

If you encounter any difficulties or have questions regarding the JavaScript SDK for Data  Layer, please reach out to our support team at [Discord #developer-discussion](https://discord.com/channels/503896258881126401/1125658694399561738). We are here to assist you and ensure a smooth experience with our SDK.

We hope this documentation provides you with a comprehensive understanding of the JavaScript SDK for the Data  Layer. Enjoy leveraging real-time data streams and unlocking the power of the Data  Layer in your JavaScript applications!
