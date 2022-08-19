import dayjs from "dayjs";
import { ethers } from "ethers";

export const makeErrorResp = (msg: string) => ({ error: true, msg });

export const getInputDocument = (
  firstName: string,
  lastName: string,
  id: string
) => {
  const issuedDate = dayjs();
  const expirationDate = issuedDate.add(10, "year");

  return {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/citizenship/v1",
      "https://w3id.org/security/bbs/v1",
    ],
    id: `https://issuer.oidp.uscis.gov/credentials/${id}`,
    type: ["VerifiableCredential", "PermanentResidentCard"],
    issuer: "did:example:489398593",
    identifier: id,
    name: "Permanent Resident Card",
    description: "Government of Example Permanent Resident Card.",
    issuanceDate: issuedDate.toISOString(),
    expirationDate: expirationDate.toISOString(),
    credentialSubject: {
      id: "did:example:b34ca6cd37bbf23",
      type: ["PermanentResident", "Person"],
      givenName: firstName.toUpperCase(),
      familyName: lastName.toUpperCase(),
      gender: "Male",
      image: "data:image/png;base64,iVBORw0KGgokJggg==",
      residentSince: "2015-01-01",
      lprCategory: "C09",
      lprNumber: "999-999-999",
      commuterClassification: "C1",
      birthCountry: "Bahamas",
      birthDate: "1958-07-17",
    },
  };
};

export const hashToBigNumber = (data: string) => {
  const hash = ethers.utils.keccak256(Buffer.from(data));
  return ethers.BigNumber.from(hash);
};
