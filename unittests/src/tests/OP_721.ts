import { opnet, OPNetUnit } from '../opnet/unit/OPNetUnit.js';
import { Assert } from '../opnet/unit/Assert.js';
import { Blockchain } from '../blockchain/Blockchain.js';
import { Address } from '@btc-vision/bsi-binary';
import { CallResponse } from '../opnet/modules/ContractRuntime.js';
import { OP_721 } from '../contracts/OP_721.js';

/* -> Uncomment this section if you need to use WBTC

import { OP_20 } from '../contracts/OP_20.js';
import { WBTC_ADDRESS } from '../contracts/configs.js';

*/

/* -> Uncomment this section if you need to use WBTC
let wbtc: OP_20;

// Helper function to mint WBTC
// Valid only in regtest and testnet
async function getWBTC(receiver: Address, amount: number): Promise<void> {
    await wbtc.resetStates();
    
    await wbtc.mint(receiver, amount);

    const currentBalance = await wbtc.balanceOfNoDecimals(receiver);
    Assert.expect(currentBalance).toEqual(amount);
}

// Helper function to approve the contract to spend WBTC
// Valid only in regtest and testnet
async function approveWBTC(receiver: Address, amount: number): Promise<void> {
    await getWBTC(receiver, amount);

    await wbtc.approve(
        receiver,
        contract.address,
        Blockchain.expandToDecimal(amount, 8),
    );
}
*/


// Replace '[ContractOwnerAddress]' with the real contract owner address
const contractOwner: Address = '[ContractOwnerAddress]';
let contract: OP_721;



await opnet('OP_721 Unit Tests', async (vm: OPNetUnit) => {
    const contractAddress: Address = Blockchain.generateRandomSegwitAddress();

    await vm.it('should instantiate the factory', async () => {
        await Assert.expect(async () => {
            const localContract = new OP_721(contractAddress);
            await localContract.init();
            localContract.dispose();
        }).toNotThrow();
    });

    contract = new OP_721(contractAddress);
    contract.preserveState();
    Blockchain.register(contract);

    /* -> Uncomment this section if you need to use WBTC
    wbtc = new OP_20('wbtc', WBTC_ADDRESS, 8);
    Blockchain.register(wbtc);
    */

    vm.beforeEach(async () => {
        Blockchain.dispose();

        await Blockchain.init();
        /* -> Uncomment this section if you need to use WBTC
        Blockchain.caller = contractOwner;
        Blockchain.callee = contractOwner;

        await approveToken(contractOwner, 100000);
        */
    });

    vm.afterAll(async () => {
        Blockchain.dispose();
    });

    /*
    This template function shows the basic of how to create your own test functions
    */
    /*
    await vm.it('Test description', async () => {
        // Set the desired caller.
        // You can set it to the contract owner or any other addresses as needed to test your method.
        Blockchain.caller = contractOwner;
        Blockchain.callee = contractOwner;

        // -> Replace [MethodName] with the desired method name.
        // -> Replace [MethodParameters] with the desired paramaters.
        // -> Replace [EventClassName] with the type of event emitted by [MethodName].

        const callResult = await contract.[MethodName]([MethodParameters]);

        // Read the event emitted by the method call.
        const event = callResult.events.shift();

        if (!event) {
            throw new Error('event not found.');
        }

        // Ensure event is of the expected type.
        Assert.expect(event.eventType).toEqual('[EventClassName]');

        const decodedEvent = OP_721.decode[EventClassName](registerClaimerEvent.eventData);

        // Do validations here...
        Assert.expect(decodedEvent.XXX).toEqual(XXX);
    });
    */
});
