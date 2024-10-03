import { NatsService } from "../pubsub/nats";
import { createAppJwt } from "../pubsub/userJwt";

// See: https://docs.synternet.com/build/dl-access-points
const natsUrl =
  "europe-west3-gcp-dl-testnet-brokernode-frankfurt01.synternet.com";
const subject = "example.mysubject";
const publisherNatsCredsFile = createAppJwt("EXAMPLE_ACCESS_TOKEN");
async function main() {
  // Connect to the NATS server with credentials
  const service = new NatsService({
    url: natsUrl,
    natsCredsFile: publisherNatsCredsFile,
  });

  console.log("Connecting to NATS server...");
  await service.waitForConnection();
  console.log("Connected to NATS server.");

  const message = { hello: "world!" };
  console.log(
    `Publishing message: ${JSON.stringify(message)} to subject: ${subject}`,
  );
  service.publishJSON(subject, message);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
