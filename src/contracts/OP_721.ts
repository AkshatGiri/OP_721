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
    StoredString,
} from '@btc-vision/btc-runtime/runtime';
import { IOP_165 } from './interfaces/IOP_165';
import { IOP_721 } from './interfaces/IOP_721';
import { IOP_721_Metadata } from './interfaces/IP_721_Metadata';
import { OP721InitParams } from './interfaces/OP721InitParams';

const namePointer: u16 = Blockchain.nextPointer;
const symbolPointer: u16 = Blockchain.nextPointer;
const baseURIPointer: u16 = Blockchain.nextPointer;

@final
export class OP_721 extends OP_NET implements IOP_165, IOP_721, IOP_721_Metadata {

    protected readonly _name: StoredString;
    protected readonly _symbol: StoredString;

    public constructor(params: OP721InitParams | null = null) {
        super();

        this._name = new StoredString(namePointer, '');
        this._symbol = new StoredString(symbolPointer, '');
        this._baseURI = new StoredString(baseURIPointer, '');

        if (params && !this._name.value) { // TODO: confirm that in assembly script empty string is falsy.
            this.instantiate(params);
        }
    }

    public _baseURI: StoredString;


    public instantiate(params: OP721InitParams): void {
        if (!this._name.value) {
            throw new Revert("Already Initialized")
        }

        this._name.value = params.name;
        this._symbol.value = params.symbol;
    }

    public supportsInterface(calldata: Calldata): BytesWriter {
        // STUB
        const response = new BytesWriter();
        return response;
    }

    public balanceOf(calldata: Calldata): BytesWriter {
        // STUB
        const response = new BytesWriter();
        return response;
    }

    public ownerOf(calldata: Calldata): BytesWriter {
        // STUB
        const response = new BytesWriter();
        return response;
    }

    public safeTransferFrom(calldata: Calldata): BytesWriter {
        // STUB
        const response = new BytesWriter();
        return response;
    }

    public transferFrom(calldata: Calldata): BytesWriter {
        // STUB
        const response = new BytesWriter();
        return response;
    }

    public approve(calldata: Calldata): BytesWriter {
        // STUB
        const response = new BytesWriter();
        return response;
    }

    public setApprovalForAll(calldata: Calldata): BytesWriter {
        // STUB
        const response = new BytesWriter();
        return response;
    }

    public getApproved(calldata: Calldata): BytesWriter {
        // STUB
        const response = new BytesWriter();
        return response;
    }

    public isApprovedForAll(calldata: Calldata): BytesWriter {
        // STUB
        const response = new BytesWriter();
        return response;
    }

    public name(): BytesWriter {
        // STUB
        const response = new BytesWriter();
        return response;
    }

    public symbol(): BytesWriter {
        // STUB
        const response = new BytesWriter();
        return response;
    }

    public tokenURI(calldata: Calldata): BytesWriter {
        // STUB
        const response = new BytesWriter();
        return response;
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
