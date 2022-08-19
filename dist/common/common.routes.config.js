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
const openpgp_1 = require("openpgp");
const contractAddress = "0x4BD023b2E66d37958A3948A7130e2Ed55FDD7c5b";
class CommonRoutesConfig {
    constructor(app, name) {
        this.ethProvider = new ethers_1.ethers.providers.JsonRpcProvider("http://localhost:8545");
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
    const privKeyBuff = Buffer.from(keyPair_1.ethPrivKey);
    const privateKey = openpgp_1.util.Uint8Array_to_str(privKeyBuff);
    const options = {
        curve: "secp256k1",
        userIds: { name: "Identity", email: "identity@somedomain.com" },
        numBits: 4096,
        material: {
            key: privateKey,
        },
    };
    //@ts-ignore
    const pgpKey = yield (0, openpgp_1.generateKey)(options);
    _a.pgpKey = pgpKey;
    const pgpPublicKey = (yield openpgp_1.key.readArmored(pgpKey.publicKeyArmored))
        .keys[0];
    _a.pgpPublicKey = pgpPublicKey;
    console.log(pgpKey.publicKeyArmored);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLnJvdXRlcy5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9jb21tb24vY29tbW9uLnJvdXRlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLDhFQUF1RTtBQUN2RSxtQ0FBZ0M7QUFDaEMsNkNBQTZDO0FBQzdDLHFDQUEwQztBQUMxQyxxQ0FJaUI7QUFFakIsTUFBTSxlQUFlLEdBQUcsNENBQTRDLENBQUM7QUFFckUsTUFBc0Isa0JBQWtCO0lBY3RDLFlBQVksR0FBd0IsRUFBRSxJQUFZO1FBWGxELGdCQUFXLEdBQUcsSUFBSSxlQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzVFLGNBQVMsR0FBRyxJQUFJLGVBQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxvQkFBVSxFQUFFLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBR25FLHFCQUFnQixHQUFHLElBQUksZUFBTSxDQUFDLFFBQVEsQ0FDcEMsZUFBZSxFQUNmLGlCQUFXLEVBQ1gsSUFBSSxDQUFDLFNBQVMsQ0FDZixDQUFDO1FBMENGLFlBQU8sR0FBRyxHQUFHLEVBQUU7WUFDYixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbkIsQ0FBQyxDQUFDO1FBeENBLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsa0JBQWtCLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDOUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7QUFwQkgsZ0RBMERDOztBQXBDUSw2QkFBVSxHQUFHLEdBQVMsRUFBRTtJQUM3QixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUkseUNBQWlCLENBQUM7UUFDMUMsRUFBRSxFQUFFLDRCQUE0QjtRQUNoQyxVQUFVLEVBQUUsdUJBQXVCO1FBQ25DLGdCQUFnQixFQUFFLDhDQUE4QztRQUNoRSxlQUFlLEVBQ2IscUlBQXFJO0tBQ3hJLENBQUMsQ0FBQztJQUNILEVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3ZCLE1BQU0sRUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzFCLENBQUMsQ0FBQSxDQUFDO0FBQ0ssNkJBQVUsR0FBRyxHQUFTLEVBQUU7SUFDN0IsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBVSxDQUFDLENBQUM7SUFDNUMsTUFBTSxVQUFVLEdBQUcsY0FBUSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzNELE1BQU0sT0FBTyxHQUFHO1FBQ2QsS0FBSyxFQUFFLFdBQVc7UUFDbEIsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUseUJBQXlCLEVBQUU7UUFDL0QsT0FBTyxFQUFFLElBQUk7UUFDYixRQUFRLEVBQUU7WUFDUixHQUFHLEVBQUUsVUFBVTtTQUNoQjtLQUNGLENBQUM7SUFDRixZQUFZO0lBQ1osTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFBLHFCQUFjLEVBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0MsRUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDckIsTUFBTSxZQUFZLEdBQUcsQ0FBQyxNQUFNLGFBQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDdEUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsRUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7SUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN2QyxDQUFDLENBQUEsQ0FBQyJ9