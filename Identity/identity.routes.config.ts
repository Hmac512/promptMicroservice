import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  deriveProof,
} from "@mattrglobal/jsonld-signatures-bbs";
import { extendContextLoader, sign, verify, purposes } from "jsonld-signatures";
import { getInputDocument, hashToBigNumber, makeErrorResp } from "./utils";
import { exampleControllerDoc } from "../data/controllerDocument";
import { bbsContext } from "../data/bbs";
import { citizenVocab } from "../data/citizenVocab";
import { suiteContext } from "../data/suiteContext";
import { credentialContext } from "../data/credentialsContext";
import { keyPairOptions } from "../data/keyPair";

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
  requiredAttributes = ["firstName", "lastName", "id"];
  constructor(app: express.Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes() {
    const keyPair = CommonRoutesConfig.keyPair;
    this.app
      .route(`/mint`)
      .post(async (req: express.Request, res: express.Response) => {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        // TODO: Prevent minting duplicate credentials. Hashing is an option, but doing it at the KYC level is better.
        const { firstName, lastName, id } = req.body;
        const inputDocument = getInputDocument(firstName, lastName, id);

        const signedDocument = await sign(inputDocument, {
          suite: new BbsBlsSignature2020({ key: keyPair }),
          purpose: new purposes.AssertionProofPurpose(),
          documentLoader,
        });
        const docString = JSON.stringify(signedDocument, null);
        await this.identityContract.mintCredential(
          hashToBigNumber(docString),
          Buffer.from(docString).toString("base64")
        );
        res.status(200).send(JSON.stringify(signedDocument));
      });

    this.app
      .route(`/verify`)
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