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
  generateVerificationId,
  getDecryptOptions,
  getInputDocument,
  getPGPKey,
  getVerificationNonce,
  hashToBigNumber,
  makeErrorResp,
  safeToJSONString,
  toBase64,
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
import { ethers } from "ethers";
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
    const issuerPGPPublicKey = CommonRoutesConfig.pgpPublicKey;
    const issuerPGPPrivateKey = CommonRoutesConfig.pgpPrivateKey;
    this.app
      .route(`/mint`)
      .post(async (req: express.Request, res: express.Response) => {
        // TODO: Prevent minting duplicate credentials. Hashing is an option, but doing it at the KYC level is better.

        const { signedPayload } = req.body;
        const clearText = await cleartext.readArmored(signedPayload);
        const payload = JSON.parse(clearText.getText());
        const { firstName, lastName, holderPublicKeyArmored } = payload;
        console.log(holderPublicKeyArmored);
        const id = generateUniqSerial();
        //await getPGPKey(PGPPublicKeyString);
        const holderPublicKey = await getPGPKey(holderPublicKeyArmored);
        const verifyOptions = {
          message: clearText,
          publicKeys: [holderPublicKey],
        };
        const verification = await pgpVerify(verifyOptions);
        if (!verification.signatures[0].valid) {
          console.error("Bad PGP Signature");
          return res.status(401).send(makeErrorResp("Bad PGP Signature"));
        }

        const inputDocument = getInputDocument(firstName, lastName, id);

        const signedDocument = await sign(inputDocument, {
          suite: new BbsBlsSignature2020({ key: keyPair }),
          purpose: new purposes.AssertionProofPurpose(),
          documentLoader,
        });
        const docString = safeToJSONString(signedDocument);
        const credentialId = hashToBigNumber(docString);
        const options = {
          message: pgpMessage.fromText(docString),
          publicKeys: [holderPublicKey, issuerPGPPublicKey],
          privateKeys: [issuerPGPPrivateKey],
        };
        const encryptedDocstring = (await pgpEncrypt(options)).data;
        const timestamp = dayjs().unix();
        let txResult: any = undefined;
        try {
          txResult = await this.identityContract.mintCredential(
            credentialId._hex,
            encryptedDocstring,
            holderPublicKeyArmored,
            timestamp
          );
        } catch (err) {
          const errMsg = `Transaction failed - ${err}`;
          console.error(errMsg);
          return res.status(401).send(makeErrorResp(errMsg));
        }
        console.log(`Mint transaction succeeded ${txResult.hash}`);

        res.status(200).send(
          JSON.stringify({
            credentialId: credentialId._hex,
            encryptedDocstring,
            timestamp,
            txHash: txResult.hash,
          })
        );
      });

    this.app
      .route(`/verify`)
      .post(async (req: express.Request, res: express.Response) => {
        const { signedPayload } = req.body;
        const clearText = await cleartext.readArmored(signedPayload);
        const payload = JSON.parse(clearText.getText());
        const {
          encryptedDocstring,
          credentialId,
          state,
          verifierPublicKeyArmored,
          verificationId,
        } = payload;
        const verifierPublicKeyHash = ethers.utils.keccak256(
          Buffer.from(verifierPublicKeyArmored, "utf8")
        );
        // Verify the payload is signed correctly by the verifier
        const verifierPublicKey = await getPGPKey(verifierPublicKeyArmored);
        const verifyOptions = {
          message: clearText,
          publicKeys: [verifierPublicKey],
        };
        const signatureVerification = await pgpVerify(verifyOptions);
        if (!signatureVerification.signatures[0].valid) {
          return res
            .status(401)
            .send(makeErrorResp("Bad Verifier PGP Signature"));
        }

        // Decrypt and verify the encrypted doc came from the credential holder

        // Get data from EVM
        const latestVerification =
          await this.identityContract.getCredentialLatestVerification(
            credentialId
          );
        const credentialHolderPublicKeyArmored =
          await this.identityContract.getCredentialHolderPublicKey(
            credentialId
          );

        const credentialHolderPublicKey = await getPGPKey(
          credentialHolderPublicKeyArmored
        );
        const decryptOptions = await getDecryptOptions(
          issuerPGPPrivateKey,
          credentialHolderPublicKey,
          encryptedDocstring
        );
        let decryptedText: string;
        try {
          const { data } = await pgpDecrypt(decryptOptions);
          decryptedText = data;
        } catch (err) {
          console.error(
            "Could not verify chain of custody of encrypted document"
          );
          return res
            .status(401)
            .send(makeErrorResp("Bad Credential Holder Signature"));
        }
        const proofDoc = JSON.parse(decryptedText);

        // Set the nonce
        const verificationNonce = getVerificationNonce(
          state,
          latestVerification._hex,
          credentialId,
          verifierPublicKeyHash
        );

        proofDoc.proof.nonce =
          Buffer.from(verificationNonce).toString("base64");

        // Verify the provided nonce correctly validates the proof doc
        const verified = await verify(proofDoc, {
          suite: new BbsBlsSignatureProof2020(),
          purpose: new purposes.AssertionProofPurpose(),
          documentLoader,
        });
        if (!verified.verified) {
          console.error("Could not verify the provided state");
          return res
            .status(401)
            .send(makeErrorResp("Unable to verify payload"));
        }

        // At this point we know the verifier is eligible to view the secrets

        const computedVerificationId = generateVerificationId(
          proofDoc,
          latestVerification._hex,
          credentialId,
          verifierPublicKeyHash
        );

        // Final sanity check to make sure everyone agrees on what is to be put on chain
        if (verificationId !== computedVerificationId) {
          console.error("Verification ID mismatch");
          return res
            .status(401)
            .send(makeErrorResp("Verification ID mismatch"));
        }

        const docString = safeToJSONString(proofDoc);
        const options = {
          message: pgpMessage.fromText(docString),
          publicKeys: [
            credentialHolderPublicKey,
            verifierPublicKey,
            issuerPGPPublicKey,
          ],
          privateKeys: [issuerPGPPrivateKey],
        };
        const encrypteDocstringWithSecrets = (await pgpEncrypt(options)).data;

        const timestamp = dayjs().unix();

        let txResult: any = undefined;
        try {
          txResult = await this.identityContract.mintVerification(
            credentialId,
            computedVerificationId,
            latestVerification._hex,
            encrypteDocstringWithSecrets,
            timestamp,
            verifierPublicKeyHash
          );
        } catch (err) {
          const errMsg = `Transaction failed - ${err}`;
          console.error(errMsg);
          return res.status(401).send(makeErrorResp(errMsg));
        }
        console.log(`Verify transaction succeeded ${txResult.hash}`);

        res.status(200).send(
          JSON.stringify({
            encrypteDocstring: encrypteDocstringWithSecrets,
            txHash: txResult.hash,
          })
        );
      });

    return this.app;
  }
}
