import base64url from "base64url";
import { addHours } from "date-fns";
import { v5 as uuid } from "uuid";
import { KeyPair, generateUserNKeys, getNKeysFromSeed } from "./nKeys";

export const jwtExpirationHours = 2;

export function createAppJwt(
  developerSeed: string,
  expirationDate: Date = addHours(new Date(), jwtExpirationHours)
) {
  const { seed: userSeed } = generateUserNKeys();
  const jwt = generateUserJwt({ userSeed, developerSeed, expirationDate });
  const computedJwt = computeJwt(jwt, userSeed);
  return computedJwt;
}

function generateUserJwt({
  userSeed,
  developerSeed,
  expirationDate,
}: {
  userSeed: string;
  developerSeed: string;
  expirationDate: Date;
}) {
  const user = getNKeysFromSeed(userSeed);
  const developer = getNKeysFromSeed(developerSeed);

  const payload = {
    jti: getJti(),
    iat: getIat(),
    exp: getExp(expirationDate),
    iss: developer.getPublicKey(),
    name: "developer",
    sub: user.getPublicKey(),
    nats: getNatsConfig(),
  };

  const jwt = signJwt(payload, developer);

  return jwt;
}

function getExp(expirationDate: Date) {
  return Math.round(expirationDate.getTime() / 1000);
}

function getJti() {
  return uuid("localhost", uuid.URL).toString();
}

function getIat() {
  return Math.round(Date.now() / 1000);
}

function signJwt(payload: any, keyPair: KeyPair): string {
  const header = {
    typ: "JWT",
    alg: "ed25519-nkey",
  };

  const jwtBase =
    base64url.encode(JSON.stringify(header)) +
    "." +
    base64url.encode(JSON.stringify(payload));
  const sigBase64Url = base64url.encode(
    Buffer.from(keyPair.sign(Buffer.from(jwtBase)))
  );
  const jwt = jwtBase + "." + sigBase64Url;

  return jwt;
}

function getNatsConfig() {
  return {
    pub: {},
    sub: {},
    subs: -1,
    data: -1,
    payload: -1,
    type: "user",
    version: 2,
  };
}

export function computeJwt(jwt: string, userNkeySeed: string) {
  return `-----BEGIN NATS USER JWT-----
  ${jwt}
  ------END NATS USER JWT------
  
  ************************* IMPORTANT *************************
  NKEY Seed printed below can be used to sign and prove identity.
  NKEYs are sensitive and should be treated as secrets.
  
  -----BEGIN USER NKEY SEED-----
  ${userNkeySeed}
  ------END USER NKEY SEED------
  
  *************************************************************`;
}
