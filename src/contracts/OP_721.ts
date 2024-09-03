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
    MultiAddressMemoryMap,
} from '@btc-vision/btc-runtime/runtime';
import { INTERFACE_ID_OP_165, IOP_165 } from './interfaces/IOP_165';
import { INTERFACE_ID_OP_721, IOP_721 } from './interfaces/IOP_721';
import { INTERFACE_ID_OP_721_Metadata, IOP_721_Metadata } from './interfaces/IP_721_Metadata';
import { OP721InitParams } from './interfaces/OP721InitParams';
import { IntToStringMemoryMap } from './utils/IntToStringMemoryMap';

const namePointer: u16 = Blockchain.nextPointer;
const symbolPointer: u16 = Blockchain.nextPointer;
const baseURIPointer: u16 = Blockchain.nextPointer;
const ownersMapPointer: u16 = Blockchain.nextPointer;
const balancesMapPointer: u16 = Blockchain.nextPointer;

const EMPTY_ADDRESS = '';

@final
export class OP_721 extends OP_NET implements IOP_165, IOP_721, IOP_721_Metadata {
    protected readonly ownersMap: IntToStringMemoryMap<u256, Address>;
    protected readonly balancesMap: AddressMemoryMap<Address, u256>;

    // TODO: token approvals and operator approvals.

    protected readonly _name: StoredString;
    protected readonly _symbol: StoredString;

    public constructor(params: OP721InitParams | null = null) {
        super();

        this._name = new StoredString(namePointer, '');
        this._symbol = new StoredString(symbolPointer, '');
        this._baseURI = new StoredString(baseURIPointer, '');
        this.ownersMap = new IntToStringMemoryMap<u256, Address>(ownersMapPointer, EMPTY_ADDRESS);
        this.balancesMap = new AddressMemoryMap<Address, u256>(balancesMapPointer, u256.Zero);

        if (params && !this._name.value) {
            // TODO: confirm that in assembly script empty string is falsy.
            this.instantiate(params);
        }
    }

    public _baseURI: StoredString;

    public instantiate(params: OP721InitParams): void {
        if (!this._name.value) {
            throw new Revert('Already Initialized');
        }

        this._name.value = params.name;
        this._symbol.value = params.symbol;
    }

    public supportsInterface(calldata: Calldata): BytesWriter {
        const response = new BytesWriter();
        const interfaceId = calldata.readU32();
        const isSupported = this._supportsInterface(interfaceId);
        response.writeBoolean(isSupported);
        return response;
    }

    protected _supportsInterface(interfaceId: u32): boolean {
        return (
            interfaceId == INTERFACE_ID_OP_165 ||
            interfaceId == INTERFACE_ID_OP_721 ||
            interfaceId == INTERFACE_ID_OP_721_Metadata
        );
    }

    public balanceOf(calldata: Calldata): BytesWriter {
        const response = new BytesWriter();
        const address: Address = calldata.readAddress();
        const resp = this._balanceOf(address);

        response.writeU256(resp);

        return response;
    }

    protected _balanceOf(owner: Address): u256 {
        if (!this.balancesMap.has(owner)) {
            return u256.Zero;
        }

        return this.balancesMap.get(owner);
    }

    public ownerOf(calldata: Calldata): BytesWriter {
        const response = new BytesWriter();
        const tokenId = calldata.readU256();
        const resp = this._ownerOf(tokenId);
        response.writeAddress(resp);
        return response;
    }

    protected _ownerOf(tokenId: u256): Address {
        const owner = this.ownersMap.get(tokenId);
        if (owner == EMPTY_ADDRESS) {
            throw new Revert('Token does not exist.');
        }

        return owner;
    }

    public safeTransferFrom(calldata: Calldata): BytesWriter {
        // STUB
        const response = new BytesWriter();
        return response;
    }

    public transferFrom(calldata: Calldata): BytesWriter {
        const response = new BytesWriter();
        const resp = this._transferFrom(
            calldata.readAddress(),
            calldata.readAddress(),
            calldata.readU256(),
        );

        response.writeBoolean(resp);

        return response;
    }

    protected _transferFrom(from: Address, to: Address, tokenId: u256): boolean {
        return true;
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
        const response = new BytesWriter();
        response.writeString(this._name.value);
        return response;
    }

    public symbol(): BytesWriter {
        const response = new BytesWriter();
        response.writeString(this._symbol.value);
        return response;
    }

    public tokenURI(calldata: Calldata): BytesWriter {
        // TODO: Match the tokenui implementation to be same as openzepplin.
        const response = new BytesWriter();
        return response;
    }
    // TODO: Allow for settin the base uri of nft.

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

    // events
}
