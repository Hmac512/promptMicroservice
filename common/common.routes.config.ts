import express from "express";
import { Bls12381G2KeyPair } from "@mattrglobal/jsonld-signatures-bbs";
import { ethers } from "ethers";
import {
  ethPrivKey,
  PGPPrivateKeyString,
  PGPPublicKeyString,
} from "../data/keyPair";
import ContractABI from "../data/abi.json";
import {
  util as pgpUtils,
  generateKey as pgpGenerateKey,
  key as pgpKey_,
} from "openpgp";
import { getPGPKey } from "../Identity/utils";

//export const contractAddress = "0x4BD023b2E66d37958A3948A7130e2Ed55FDD7c5b";
export const contractAddress = "0xc11B96C03E50172a200A6dd1229BB780cBbf1a4e";

export abstract class CommonRoutesConfig {
  app: express.Application;
  name: string;
  //ethProvider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
  ethProvider = new ethers.providers.JsonRpcProvider(
    "https://eth-rinkeby.alchemyapi.io/v2/rZyczYFE3MMFrANNaZ2TqeN20XPsmw_w"
  );
  ethSigner = new ethers.Wallet(`0x${ethPrivKey}`, this.ethProvider);
  static pgpPrivateKey: pgpKey_.Key;
  static pgpPublicKey: pgpKey_.Key;
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
    const publicKey = await getPGPKey(PGPPublicKeyString);
    this.pgpPublicKey = publicKey;

    const privateKey = await getPGPKey(PGPPrivateKeyString);
    this.pgpPrivateKey = privateKey;
  };

  getName = () => {
    return this.name;
  };

  abstract configureRoutes(): express.Application;
}
