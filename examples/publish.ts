import { NatsService } from "../pubsub/nats";

const natsUrl = "url-to-nats.com";
const subject = "hackathon.mysubject";
const publisherNatsCredsFile = `-----BEGIN NATS USER JWT-----
eyJ0eXAi111V1QiLCJhbGciOiJlZDI1NTE5LW5rZXkifQ.eyJqdGk222JCVDNOSkgyWjczWlkyN1JZRFk1TVpWNFFKRE1VTTdTWE5DVUtQUFZBWU9PNFNINTI3SFJBIiwiaWF0IjoxNjgzNzAxNjQzLCJpc3MiOiJBQjU2T0VQSUdNUUVEREZWQVQ3M1ZWT1RLRlc2T1BHNEZCNVdNRzZRUjdHQlBUSlJJTVdJQVRMMiIsIm5hbWUiOiJIYWNrYXRob24gVXNlciIsInN1YiI6IlVDUUFBV1hXVFRXWkZDTFJZNVlIT1BLVzdETVlNUTNVT1ZYTFdHUUtRMlJZVFJXVEFaTzNaNVhGIiwibmF0cyI6eyJwdWIiOnt9LCJzdWIiOnt9LCJzdWJzIjotMSwiZGF0YSI6LTEsInBheWxvYWQiOi0xLCJ0eXBlIjoidXNlciIsInZlcnNpb2444jJ9fQ.kz6iaIG5NysbczRxTuqr69y6c7YfwvZSuJZ-xXZPDVph333okZEWvRwM6dkMYC3p-qlY7sKiQdqr6eEt1iftAA
------END NATS USER JWT------

************************* IMPORTANT *************************
NKEY Seed printed below can be used to sign and prove identity.
NKEYs are sensitive and should be treated as secrets.

-----BEGIN USER NKEY SEED-----
SUAAFVCCCFQB4445DWNGCV4SAAAS77XEN523SP3A32MOR6EBBBGWTZUM
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
