import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import {
  generateBls12381G2KeyPair,
  blsSign,
  blsVerify,
  blsCreateProof,
  blsVerifyProof,
} from "@mattrglobal/bbs-signatures";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes() {
    const keyPair = CommonRoutesConfig.keyPair;
    this.app
      .route(`/users`)
      .get(async (req: express.Request, res: express.Response) => {
        const messages = [
          Uint8Array.from(Buffer.from("message1", "utf-8")),
          Uint8Array.from(Buffer.from("message2", "utf-8")),
        ];
        const signature = await blsSign({
          keyPair,
          messages: messages,
        });

        const proof = await blsCreateProof({
          signature,
          publicKey: keyPair.publicKey,
          messages,
          nonce: Uint8Array.from(Buffer.from("nonce", "utf8")),
          revealed: [0],
        });

        res.status(200).send(Buffer.from(proof).toString("base64"));
      })
      .post((req: express.Request, res: express.Response) => {
        res.status(200).send(`Post to users`);
      });

    this.app
      .route(`/users/:userId`)
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
      })
      .put((req: express.Request, res: express.Response) => {
        res.status(200).send(`PUT requested for id ${req.params.userId}`);
      })
      .patch((req: express.Request, res: express.Response) => {
        res.status(200).send(`PATCH requested for id ${req.params.userId}`);
      })
      .delete((req: express.Request, res: express.Response) => {
        res.status(200).send(`DELETE requested for id ${req.params.userId}`);
      });

    return this.app;
  }
}
