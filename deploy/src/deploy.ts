import { deployContract } from './deployContract.js';

console.log(`Deploying contract: OP_721`);

const contractsToDeploy = ['../../build/OP_721.wasm'];
const contracts = await deployContract(contractsToDeploy);

console.log(`Contracts deployed:`, contracts);