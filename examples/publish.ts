import { NatsService } from "../pubsub/nats";

const natsUrl = "url-to-nats.com";
const subject = "example.mysubject";
const publisherNatsCredsFile = `-----BEGIN NATS USER JWT-----
PLEASE_CONTACT_US_FOR_JWT_VALUE
------END NATS USER JWT------

************************* IMPORTANT *************************
NKEY Seed printed below can be used to sign and prove identity.
NKEYs are sensitive and should be treated as secrets.

-----BEGIN USER NKEY SEED-----
PLEASE_CONTACT_US_FOR_NKEY_SEED_VALUE
------END USER NKEY SEED------

*************************************************************`;

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
    `Publishing message: ${JSON.stringify(message)} to subject: ${subject}`
  );
  service.publishJSON(subject, message);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
