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
        name: "encryptedCredential",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ownerPublicKey",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "issuedTimestamp",
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
        name: "encryptedCredential",
        type: "string",
      },
      {
        internalType: "string",
        name: "ownerPublicKey",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "issuedTimestamp",
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
        name: "encryptedCredential",
        type: "string",
      },
      {
        internalType: "string",
        name: "ownerPublicKey",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "issuedTimestamp",
        type: "uint256",
      },
    ],
    name: "mintCredential",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "publicKey",
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
];
