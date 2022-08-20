"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonRoutesConfig = exports.contractAddress = void 0;
const jsonld_signatures_bbs_1 = require("@mattrglobal/jsonld-signatures-bbs");
const ethers_1 = require("ethers");
const keyPair_1 = require("../data/keyPair");
const abi_1 = require("../data/abi");
const utils_1 = require("../Identity/utils");
//export const contractAddress = "0x4BD023b2E66d37958A3948A7130e2Ed55FDD7c5b";
exports.contractAddress = "0xc11B96C03E50172a200A6dd1229BB780cBbf1a4e";
class CommonRoutesConfig {
    constructor(app, name) {
        // ethProvider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
        this.ethProvider = new ethers_1.ethers.providers.JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/rZyczYFE3MMFrANNaZ2TqeN20XPsmw_w");
        this.ethSigner = new ethers_1.ethers.Wallet(`0x${keyPair_1.ethPrivKey}`, this.ethProvider);
        this.identityContract = new ethers_1.ethers.Contract(exports.contractAddress, abi_1.ContractABI, this.ethSigner);
        this.getName = () => {
            return this.name;
        };
        this.app = app;
        this.name = name;
        CommonRoutesConfig.loadBLSKey().then((result) => {
            this.configureRoutes();
        });
    }
}
exports.CommonRoutesConfig = CommonRoutesConfig;
_a = CommonRoutesConfig;
CommonRoutesConfig.loadBLSKey = () => __awaiter(void 0, void 0, void 0, function* () {
    const keyPair = yield new jsonld_signatures_bbs_1.Bls12381G2KeyPair({
        id: "did:example:489398593#test",
        controller: "did:example:489398593",
        privateKeyBase58: "5D6Pa8dSwApdnfg7EZR8WnGfvLDCZPZGsZ5Y1ELL9VDj",
        publicKeyBase58: "oqpWYKaZD9M1Kbe94BVXpr8WTdFBNZyKv48cziTiQUeuhm7sBhCABMyYG4kcMrseC68YTFFgyhiNeBKjzdKk9MiRWuLv5H4FFujQsQK2KTAtzU8qTBiZqBHMmnLF4PL7Ytu",
    });
    _a.keyPair = keyPair;
    yield _a.loadPGPKey();
});
CommonRoutesConfig.loadPGPKey = () => __awaiter(void 0, void 0, void 0, function* () {
    const publicKey = yield (0, utils_1.getPGPKey)(keyPair_1.PGPPublicKeyString);
    _a.pgpPublicKey = publicKey;
    const privateKey = yield (0, utils_1.getPGPKey)(keyPair_1.PGPPrivateKeyString);
    _a.pgpPrivateKey = privateKey;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLnJvdXRlcy5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9jb21tb24vY29tbW9uLnJvdXRlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLDhFQUF1RTtBQUN2RSxtQ0FBZ0M7QUFDaEMsNkNBSXlCO0FBQ3pCLHFDQUEwQztBQU0xQyw2Q0FBOEM7QUFFOUMsOEVBQThFO0FBQ2pFLFFBQUEsZUFBZSxHQUFHLDRDQUE0QyxDQUFDO0FBRTVFLE1BQXNCLGtCQUFrQjtJQWlCdEMsWUFBWSxHQUF3QixFQUFFLElBQVk7UUFkbEQsK0VBQStFO1FBQy9FLGdCQUFXLEdBQUcsSUFBSSxlQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FDaEQsdUVBQXVFLENBQ3hFLENBQUM7UUFDRixjQUFTLEdBQUcsSUFBSSxlQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssb0JBQVUsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUduRSxxQkFBZ0IsR0FBRyxJQUFJLGVBQU0sQ0FBQyxRQUFRLENBQ3BDLHVCQUFlLEVBQ2YsaUJBQVcsRUFDWCxJQUFJLENBQUMsU0FBUyxDQUNmLENBQUM7UUE4QkYsWUFBTyxHQUFHLEdBQUcsRUFBRTtZQUNiLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuQixDQUFDLENBQUM7UUE1QkEsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUM5QyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOztBQXZCSCxnREFpREM7O0FBeEJRLDZCQUFVLEdBQUcsR0FBUyxFQUFFO0lBQzdCLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSx5Q0FBaUIsQ0FBQztRQUMxQyxFQUFFLEVBQUUsNEJBQTRCO1FBQ2hDLFVBQVUsRUFBRSx1QkFBdUI7UUFDbkMsZ0JBQWdCLEVBQUUsOENBQThDO1FBQ2hFLGVBQWUsRUFDYixxSUFBcUk7S0FDeEksQ0FBQyxDQUFDO0lBQ0gsRUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDdkIsTUFBTSxFQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDMUIsQ0FBQyxDQUFBLENBQUM7QUFDSyw2QkFBVSxHQUFHLEdBQVMsRUFBRTtJQUM3QixNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsaUJBQVMsRUFBQyw0QkFBa0IsQ0FBQyxDQUFDO0lBQ3RELEVBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO0lBRTlCLE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBQSxpQkFBUyxFQUFDLDZCQUFtQixDQUFDLENBQUM7SUFDeEQsRUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7QUFDbEMsQ0FBQyxDQUFBLENBQUMifQ==