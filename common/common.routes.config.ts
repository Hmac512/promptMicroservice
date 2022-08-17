import express from "express";

import { BlsKeyPair } from "@mattrglobal/bbs-signatures";
import { generateBls12381G2KeyPair } from "@mattrglobal/bbs-signatures";

export abstract class CommonRoutesConfig {
  app: express.Application;
  name: string;
  static keyPair: Required<BlsKeyPair>;

  constructor(app: express.Application, name: string) {
    this.app = app;
    this.name = name;
    CommonRoutesConfig.generateKey().then((result) => {
      this.configureRoutes();
    });
  }

  static generateKey = async () => {
    const seed = Uint8Array.from(Buffer.from("key-seed", "utf-8"));
    const keyPair = await generateBls12381G2KeyPair(seed);
    this.keyPair = keyPair;
  };

  getName = () => {
    return this.name;
  };

  abstract configureRoutes(): express.Application;
}
