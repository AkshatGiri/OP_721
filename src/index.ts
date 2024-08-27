import { ABIRegistry, Blockchain } from '@btc-vision/btc-runtime/runtime';
import { OP_721 } from './contracts/OP_721';

export function defineSelectors(): void {
    /** OP_NET */
    ABIRegistry.defineGetterSelector('address', false);
    ABIRegistry.defineGetterSelector('owner', false);
    ABIRegistry.defineMethodSelector('isAddressOwner', false);

    // OP_721 contract
    /*
    Register your contract functions here using the ABIRegistry.defineMethodSelector();
    First parameter is the contract function name.
    Second parameter is a boolean indicating if the function can write.
    */
}

Blockchain.contract = () => new OP_721();

// VERY IMPORTANT
export * from '@btc-vision/btc-runtime/runtime/exports';
