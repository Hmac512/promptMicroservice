import express from "express";
import { Bls12381G2KeyPair } from "@mattrglobal/jsonld-signatures-bbs";
import { ethers } from "ethers";
import { ethPrivKey } from "../data/keyPair";
import { ContractABI } from "../data/abi";
import {
  util as pgpUtils,
  generateKey as pgpGenerateKey,
  key as pgpKey_,
} from "openpgp";

const contractAddress = "0x4BD023b2E66d37958A3948A7130e2Ed55FDD7c5b";

export abstract class CommonRoutesConfig {
  app: express.Application;
  name: string;
  ethProvider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
  ethSigner = new ethers.Wallet(`0x${ethPrivKey}`, this.ethProvider);
  static pgpKey: any;
  static pgpPublicKey: any;
  identityContract = new ethers.Contract(
    contractAddress,
    ContractABI,
    this.ethSigner
  );
  static keyPair: Bls12381G2KeyPair;

  constructor(app: express.Application, name: string) {
    this.app = app;
    this.name = name;
    CommonRoutesConfig.loadBLSKey().then((result) => {
      this.configureRoutes();
    });
  }

  static loadBLSKey = async () => {
    const keyPair = await new Bls12381G2KeyPair({
      id: "did:example:489398593#test",
      controller: "did:example:489398593",
      privateKeyBase58: "5D6Pa8dSwApdnfg7EZR8WnGfvLDCZPZGsZ5Y1ELL9VDj",
      publicKeyBase58:
        "oqpWYKaZD9M1Kbe94BVXpr8WTdFBNZyKv48cziTiQUeuhm7sBhCABMyYG4kcMrseC68YTFFgyhiNeBKjzdKk9MiRWuLv5H4FFujQsQK2KTAtzU8qTBiZqBHMmnLF4PL7Ytu",
    });
    this.keyPair = keyPair;
    await this.loadPGPKey();
  };
  static loadPGPKey = async () => {
    const privKeyBuff = Buffer.from(ethPrivKey);
    const privateKey = pgpUtils.Uint8Array_to_str(privKeyBuff);
    const options = {
      curve: "secp256k1",
      userIds: { name: "Identity", email: "identity@somedomain.com" },
      numBits: 4096,
      material: {
        key: privateKey,
      },
    };
    //@ts-ignore
    const pgpKey = await pgpGenerateKey(options);
    this.pgpKey = pgpKey;
    const pgpPublicKey = (await pgpKey_.readArmored(pgpKey.publicKeyArmored))
      .keys[0];
    this.pgpPublicKey = pgpPublicKey;
    console.log(pgpKey.publicKeyArmored);
  };

  getName = () => {
    return this.name;
  };

  abstract configureRoutes(): express.Application;
}
