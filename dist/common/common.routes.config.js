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
exports.CommonRoutesConfig = void 0;
const jsonld_signatures_bbs_1 = require("@mattrglobal/jsonld-signatures-bbs");
const ethers_1 = require("ethers");
const keyPair_1 = require("../data/keyPair");
const abi_1 = require("../data/abi");
const utils_1 = require("../Identity/utils");
const contractAddress = "0x4BD023b2E66d37958A3948A7130e2Ed55FDD7c5b";
class CommonRoutesConfig {
    constructor(app, name) {
        this.ethProvider = new ethers_1.ethers.providers.JsonRpcProvider("http://localhost:8545");
        // ethProvider = new ethers.providers.JsonRpcProvider(
        //   "https://eth-rinkeby.alchemyapi.io/v2/rZyczYFE3MMFrANNaZ2TqeN20XPsmw_w"
        // );
        this.ethSigner = new ethers_1.ethers.Wallet(`0x${keyPair_1.ethPrivKey}`, this.ethProvider);
        this.identityContract = new ethers_1.ethers.Contract(contractAddress, abi_1.ContractABI, this.ethSigner);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLnJvdXRlcy5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9jb21tb24vY29tbW9uLnJvdXRlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLDhFQUF1RTtBQUN2RSxtQ0FBZ0M7QUFDaEMsNkNBSXlCO0FBQ3pCLHFDQUEwQztBQU0xQyw2Q0FBOEM7QUFFOUMsTUFBTSxlQUFlLEdBQUcsNENBQTRDLENBQUM7QUFFckUsTUFBc0Isa0JBQWtCO0lBaUJ0QyxZQUFZLEdBQXdCLEVBQUUsSUFBWTtRQWRsRCxnQkFBVyxHQUFHLElBQUksZUFBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUM1RSxzREFBc0Q7UUFDdEQsNEVBQTRFO1FBQzVFLEtBQUs7UUFDTCxjQUFTLEdBQUcsSUFBSSxlQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssb0JBQVUsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUduRSxxQkFBZ0IsR0FBRyxJQUFJLGVBQU0sQ0FBQyxRQUFRLENBQ3BDLGVBQWUsRUFDZixpQkFBVyxFQUNYLElBQUksQ0FBQyxTQUFTLENBQ2YsQ0FBQztRQThCRixZQUFPLEdBQUcsR0FBRyxFQUFFO1lBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25CLENBQUMsQ0FBQztRQTVCQSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQzlDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7O0FBdkJILGdEQWlEQzs7QUF4QlEsNkJBQVUsR0FBRyxHQUFTLEVBQUU7SUFDN0IsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLHlDQUFpQixDQUFDO1FBQzFDLEVBQUUsRUFBRSw0QkFBNEI7UUFDaEMsVUFBVSxFQUFFLHVCQUF1QjtRQUNuQyxnQkFBZ0IsRUFBRSw4Q0FBOEM7UUFDaEUsZUFBZSxFQUNiLHFJQUFxSTtLQUN4SSxDQUFDLENBQUM7SUFDSCxFQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN2QixNQUFNLEVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUMxQixDQUFDLENBQUEsQ0FBQztBQUNLLDZCQUFVLEdBQUcsR0FBUyxFQUFFO0lBQzdCLE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBQSxpQkFBUyxFQUFDLDRCQUFrQixDQUFDLENBQUM7SUFDdEQsRUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7SUFFOUIsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFBLGlCQUFTLEVBQUMsNkJBQW1CLENBQUMsQ0FBQztJQUN4RCxFQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQztBQUNsQyxDQUFDLENBQUEsQ0FBQyJ9