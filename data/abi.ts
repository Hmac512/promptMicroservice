export const ContractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "blsKey",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "credentialId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "encryptedDocument",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "holderPublicKey",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "MintCredential",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "credentialId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "verificationId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "previousVerification",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "encryptedDocument",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "verifierPublicKeyHash",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "MintVerification",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "blsPublicKey",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "credentials",
    outputs: [
      {
        internalType: "string",
        name: "encryptedDocument",
        type: "string",
      },
      {
        internalType: "string",
        name: "holderPublicKey",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "latestVerification",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "credentialId",
        type: "uint256",
      },
    ],
    name: "getCredentialEncryptedDocument",
    outputs: [
      {
        internalType: "string",
        name: "encryptedDocument",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "credentialId",
        type: "uint256",
      },
    ],
    name: "getCredentialHolderPublicKey",
    outputs: [
      {
        internalType: "string",
        name: "holderPublicKey",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "credentialId",
        type: "uint256",
      },
    ],
    name: "getCredentialLatestVerification",
    outputs: [
      {
        internalType: "uint256",
        name: "verificationId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "credentialId",
        type: "uint256",
      },
    ],
    name: "getCredentialTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "verificationId",
        type: "uint256",
      },
    ],
    name: "getVerificationCredentialId",
    outputs: [
      {
        internalType: "uint256",
        name: "credentialId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "verificationId",
        type: "uint256",
      },
    ],
    name: "getVerificationEncryptedDocument",
    outputs: [
      {
        internalType: "string",
        name: "encryptedDocument",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "verificationId",
        type: "uint256",
      },
    ],
    name: "getVerificationPreviousVerification",
    outputs: [
      {
        internalType: "uint256",
        name: "previousVerification",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "verificationId",
        type: "uint256",
      },
    ],
    name: "getVerificationTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "verificationId",
        type: "uint256",
      },
    ],
    name: "getVerificationVerifierPublicKeyHash",
    outputs: [
      {
        internalType: "uint256",
        name: "verifierPublicKeyHash",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "credentialId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "encryptedDocument",
        type: "string",
      },
      {
        internalType: "string",
        name: "holderPublicKey",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "mintCredential",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "credentialId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "verificationId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "previousVerificationId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "encryptedDocument",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "verifierPublicKeyHash",
        type: "uint256",
      },
    ],
    name: "mintVerification",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "publicKey",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "blsPublicKey_",
        type: "string",
      },
      {
        internalType: "string",
        name: "publicKey_",
        type: "string",
      },
    ],
    name: "setBLSPublicKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "verifications",
    outputs: [
      {
        internalType: "uint256",
        name: "credentialId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "previousVerification",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "encryptedDocument",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "verifierPublicKeyHash",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
