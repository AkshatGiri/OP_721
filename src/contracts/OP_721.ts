import { u128, u256 } from 'as-bignum/assembly';

import {
    Address,
    AddressMemoryMap,
    Blockchain,
    BytesWriter,
    Calldata,
    encodeSelector,
    MemorySlotData,
    OP_NET,
    OP20Utils,
    Revert,
    SafeMath,
    Selector,
    StoredU256,
    TransferHelper,
} from '@btc-vision/btc-runtime/runtime';

@final
export class OP_721 extends OP_NET {

    constructor() {
        super();
    }

    public override callMethod(method: Selector, calldata: Calldata): BytesWriter {
        switch (method) {
            default:
                return super.callMethod(method, calldata);
        }
    }

    public override callView(method: Selector): BytesWriter {
        const response = new BytesWriter();

        switch (method) {
            default:
                return super.callView(method);
        }

        return response;
    }
}
