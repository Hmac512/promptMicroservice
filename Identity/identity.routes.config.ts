import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  deriveProof,
} from "@mattrglobal/jsonld-signatures-bbs";
import { extendContextLoader, sign, verify, purposes } from "jsonld-signatures";
import {
  generateUniqSerial,
  getDecryptOptions,
  getInputDocument,
  getPGPKey,
  hashToBigNumber,
  makeErrorResp,
} from "./utils";
import { exampleControllerDoc } from "../data/controllerDocument";
import { bbsContext } from "../data/bbs";
import { citizenVocab } from "../data/citizenVocab";
import { suiteContext } from "../data/suiteContext";
import { credentialContext } from "../data/credentialsContext";
import { keyPairOptions } from "../data/keyPair";
import {
  util as pgpUtils,
  generateKey as pgpGenerateKey,
  key as pgpKey_,
  sign as pgpSign,
  cleartext,
  verify as pgpVerify,
  message as pgpMessage,
  encrypt as pgpEncrypt,
  decrypt as pgpDecrypt,
} from "openpgp";
import dayjs from "dayjs";
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const documents: any = {
  "did:example:489398593#test": keyPairOptions,
  "did:example:489398593": exampleControllerDoc,
  "https://w3id.org/security/bbs/v1": bbsContext,
  "https://w3id.org/citizenship/v1": citizenVocab,
  "https://www.w3.org/2018/credentials/v1": credentialContext,
  "https://w3id.org/security/suites/jws-2020/v1": suiteContext,
};
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const customDocLoader = (url: string): any => {
  const context = documents[url];

  if (context) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: context, // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  }

  console.log(
    `Attempted to remote load context : '${url}', please cache instead`
  );
  throw new Error(
    `Attempted to remote load context : '${url}', please cache instead`
  );
};
const documentLoader: any = extendContextLoader(customDocLoader);

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes() {
    const keyPair = CommonRoutesConfig.keyPair;
    const pgpPublicKey = CommonRoutesConfig.pgpPublicKey;
    const pgpPrivateKey = CommonRoutesConfig.pgpPrivateKey;
    this.app
      .route(`/mint`)
      .post(async (req: express.Request, res: express.Response) => {
        // TODO: Prevent minting duplicate credentials. Hashing is an option, but doing it at the KYC level is better.

        const { signedPayload } = req.body;
        const clearText = await cleartext.readArmored(signedPayload);
        const payload = JSON.parse(clearText.getText());
        const { firstName, lastName, pgpPublicKeyArmored } = payload;
        const id = generateUniqSerial();
        const ownerPgpPublicKey = (
          await pgpKey_.readArmored(pgpPublicKeyArmored)
        ).keys[0];
        const verifyOptions = {
          message: clearText,
          publicKeys: [pgpPublicKey],
        };
        const verification = await pgpVerify(verifyOptions);
        if (!verification.signatures[0].valid) {
          return res.status(401).send(makeErrorResp("Bad PGP Signature"));
        }

        const inputDocument = getInputDocument(firstName, lastName, id);

        const signedDocument = await sign(inputDocument, {
          suite: new BbsBlsSignature2020({ key: keyPair }),
          purpose: new purposes.AssertionProofPurpose(),
          documentLoader,
        });
        const docString = JSON.stringify(signedDocument, null);
        const credentialId = hashToBigNumber(docString);
        const options = {
          message: pgpMessage.fromText(docString),
          publicKeys: [ownerPgpPublicKey, pgpPublicKey],
          privateKeys: [pgpPrivateKey],
        };
        const encryptedDocstring = (await pgpEncrypt(options)).data;

        const timestamp = dayjs().unix();
        await this.identityContract.mintCredential(
          credentialId._hex,
          encryptedDocstring,
          pgpPublicKeyArmored,
          timestamp
        );
        res.status(200).send(
          JSON.stringify({
            credentialId: credentialId._hex,
            encryptedDocstring,
            timestamp,
          })
        );
      });

    this.app
      .route(`/verify`)
      .post(async (req: express.Request, res: express.Response) => {
        const { encryptedDocstring, credentialId, state, verificationId } =
          req.body;
        console.log(credentialId);
        const latestVerification =
          await this.identityContract.getLatestVerification(credentialId);
        const ownerPublicKeyString =
          await this.identityContract.getCredentialOwnerPublicKey(credentialId);
        console.log(latestVerification, ownerPublicKeyString);
        const ownerPublicKey = await getPGPKey(ownerPublicKeyString);
        const decryptOptions = await getDecryptOptions(
          pgpPrivateKey,
          encryptedDocstring
        );
        const { data: decryptedText } = await pgpDecrypt(decryptOptions);
        console.log(decryptedText);

        res.status(200).send(`GET requested for id ${req.params.userId}`);
      });

    this.app
      .route(`/publicKey`)
      .all(
        (
          req: express.Request,
          res: express.Response,
          next: express.NextFunction
        ) => {
          // this middleware function runs before any request to /users/:userId
          // but it doesn't accomplish anything just yet---
          // it simply passes control to the next applicable function below using next()
          next();
        }
      )
      .get((req: express.Request, res: express.Response) => {
        res.status(200).send(Buffer.from(keyPair.publicKey).toString("base64"));
      });

    return this.app;
  }
}
