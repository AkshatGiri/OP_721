import { u256 } from 'as-bignum/assembly';

import {
    Address,
    AddressMemoryMap,
    Blockchain,
    BytesWriter,
    Calldata,
    MemorySlotData,
    MultiAddressMemoryMap,
    OP_NET,
    Revert,
    Selector,
    StoredString,
} from '@btc-vision/btc-runtime/runtime';
import { INTERFACE_ID_OP_165, IOP_165 } from './interfaces/IOP_165';
import { INTERFACE_ID_OP_721, IOP_721 } from './interfaces/IOP_721';
import { INTERFACE_ID_OP_721_Metadata, IOP_721_Metadata } from './interfaces/IP_721_Metadata';
import { OP721InitParams } from './interfaces/OP721InitParams';
import { IntToStringMemoryMap } from './utils/IntToStringMemoryMap';
import { TransferEvent } from './events/TransferEvent';
import { ApprovalEvent } from './events/ApprovalEvent';
import { ApprovalForAllEvent } from './events/ApprovalForAllEvent';
import { BurnEvent } from './events/BurnEvent';
import { MintEvent } from './events/MintEvent';

const namePointer: u16 = Blockchain.nextPointer;
const symbolPointer: u16 = Blockchain.nextPointer;
const baseURIPointer: u16 = Blockchain.nextPointer;
const ownersMapPointer: u16 = Blockchain.nextPointer;
const balancesMapPointer: u16 = Blockchain.nextPointer;
const tokenApprovalsMapPointer: u16 = Blockchain.nextPointer;
const operatorApprovalsMapPointer: u16 = Blockchain.nextPointer;

const EMPTY_ADDRESS = '';

type U256Boolean = u256;

@final
export class OP_721 extends OP_NET implements IOP_165, IOP_721, IOP_721_Metadata {
    protected readonly ownersMap: IntToStringMemoryMap<u256, MemorySlotData<Address>>;
    protected readonly balancesMap: AddressMemoryMap<Address, MemorySlotData<u256>>;
    protected readonly tokenApprovalsMap: IntToStringMemoryMap<u256, MemorySlotData<Address>>;
    protected readonly operatorApprovalsMap: MultiAddressMemoryMap<
        Address,
        Address,
        MemorySlotData<U256Boolean>
    >;

    protected readonly _name: StoredString;
    protected readonly _symbol: StoredString;
    public _baseURI: StoredString;

    public constructor(params: OP721InitParams | null = null) {
        super();

        this._name = new StoredString(namePointer, '');
        this._symbol = new StoredString(symbolPointer, '');
        this._baseURI = new StoredString(baseURIPointer, '');
        this.ownersMap = new IntToStringMemoryMap<u256, Address>(ownersMapPointer, EMPTY_ADDRESS);
        this.balancesMap = new AddressMemoryMap<Address, u256>(balancesMapPointer, u256.Zero);
        this.tokenApprovalsMap = new IntToStringMemoryMap<u256, Address>(
            tokenApprovalsMapPointer,
            EMPTY_ADDRESS,
        );
        this.operatorApprovalsMap = new MultiAddressMemoryMap<Address, Address, U256Boolean>(
            operatorApprovalsMapPointer,
            u256.Zero,
        );

        if (params && !this._name.value) {
            // TODO: confirm that in assembly script empty string is falsy.
            this.instantiate(params);
        }
    }

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
        const balance = this._balanceOf(address);

        response.writeU256(balance);

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
        const owner = this._ownerOf(tokenId);
        response.writeAddress(owner);
        return response;
    }

    protected _ownerOf(tokenId: u256): Address {
        return this.ownersMap.get(tokenId);
    }

    /**
     * @dev Reverts if the `tokenId` doesn't have a current owner (it hasn't been minted, or it has been burned).
     * Returns the owner.
     *
     * Overrides to ownership logic should be done to {_ownerOf}.
     */
    protected _requireOwned(tokenId: u256): Address {
        const owner = this._ownerOf(tokenId);
        if (owner == EMPTY_ADDRESS) {
            throw new Revert(`Token ${tokenId} does not exist.`);
        }
        return owner;
    }

    public approve(calldata: Calldata): BytesWriter {
        const response = new BytesWriter();
        const to = calldata.readAddress();
        const tokenId = calldata.readU256();
        const resp = this._approve(to, tokenId);
        response.writeBoolean(resp);
        return response;
    }

    protected _approve(to: Address, tokenId: u256): boolean {
        const owner = this._requireOwned(tokenId);
        if (Blockchain.sender != owner && !this._isApprovedForAll(owner, Blockchain.sender)) {
            throw new Revert(`Not authroized to approve ${tokenId}`);
        }

        this.tokenApprovalsMap.set(tokenId, to);

        this.createApprovalEvent(owner, to, tokenId);

        return true;
    }

    public getApproved(calldata: Calldata): BytesWriter {
        const response = new BytesWriter();
        const tokenId = calldata.readU256();
        const resp = this._getApproved(tokenId);
        response.writeAddress(resp);

        return response;
    }

    protected _getApproved(tokenId: u256): Address {
        this._requireOwned(tokenId);

        return this.tokenApprovalsMap.get(tokenId);
    }

    public setApprovalForAll(calldata: Calldata): BytesWriter {
        const response = new BytesWriter();
        const operator = calldata.readAddress();
        const approved = calldata.readBoolean();
        const resp = this._setApprovalForAll(Blockchain.sender, operator, approved);
        response.writeBoolean(resp);
        return response;
    }

    protected _setApprovalForAll(owner: Address, operator: Address, approved: boolean): boolean {
        const operatorApprovals = this.operatorApprovalsMap.get(owner);
        operatorApprovals.set(operator, u256.from<bool>(approved));

        this.createApprovalForAllEvent(owner, operator, approved);

        return true;
    }

    public isApprovedForAll(calldata: Calldata): BytesWriter {
        const response = new BytesWriter();
        const owner = calldata.readAddress();
        const operator = calldata.readAddress();
        const isApproved = this._isApprovedForAll(owner, operator);
        response.writeBoolean(isApproved);
        return response;
    }

    protected _isApprovedForAll(owner: Address, operator: Address): boolean {
        const operatorApprovals = this.operatorApprovalsMap.get(owner);
        return operatorApprovals.get(operator).as<boolean>();
    }

    protected _isAuthorized(owner: Address, spender: Address, tokenId: u256): boolean {
        return (
            owner == spender ||
            this._isApprovedForAll(owner, spender) ||
            this._getApproved(tokenId) == spender
        );
    }

    protected _mint(to: Address, tokenId: u256): boolean {
        if (this.ownersMap.has(tokenId)) {
            throw new Revert('Token already exists');
        }

        this.ownersMap.set(tokenId, to);
        this.balancesMap.set(to, u256.add(this.balancesMap.get(to), u256.One));

        this.createMintEvent(to, tokenId);

        return true;
    }

    public _safeMint(to: Address, tokenId: u256): boolean {
        return this._mint(to, tokenId);
    }

    public _burn(tokenId: u256): boolean {
        const owner = this._requireOwned(tokenId);
        if (owner != Blockchain.sender) {
            throw new Revert('Not authorized to burn token');
        }

        this.ownersMap.delete(tokenId);
        this.balancesMap.set(owner, u256.sub(this.balancesMap.get(owner), u256.One));

        this.createBurnEvent(tokenId);

        return true;
    }

    public transferFrom(calldata: Calldata): BytesWriter {
        const response = new BytesWriter();
        const from = calldata.readAddress();
        const to = calldata.readAddress();
        const tokenId = calldata.readU256();
        const resp = this._transferFrom(from, to, tokenId);

        response.writeBoolean(resp);
        return response;
    }

    protected _transferFrom(from: Address, to: Address, tokenId: u256): boolean {
        if (Blockchain.sender !== from) {
            throw new Revert('Not caller.');
        }

        if (!this._isAuthorized(from, Blockchain.sender, tokenId)) {
            throw new Revert('Not authorized to transfer token');
        }

        if (Blockchain.sender == to) {
            throw new Revert('Cannot transfer to self.');
        }

        this.ownersMap.set(tokenId, to);
        this.balancesMap.set(from, u256.sub(this.balancesMap.get(from), u256.One));
        this.balancesMap.set(to, u256.add(this.balancesMap.get(to), u256.One));
        // clear approvals from the previous owner
        this.tokenApprovalsMap.set(tokenId, EMPTY_ADDRESS);

        this.createTransferEvent(from, to, tokenId);

        return true;
    }

    public safeTransferFrom(calldata: Calldata): BytesWriter {
        const response = new BytesWriter();
        const from = calldata.readAddress();
        const to = calldata.readAddress();
        const tokenId = calldata.readU256();
        const resp = this._safeTransferFrom(from, to, tokenId);

        response.writeBoolean(resp);
        return response;
    }

    protected _safeTransferFrom(from: Address, to: Address, tokenId: u256): boolean {
        // TODO: Need to know if there's a way to check if an address is a contract address
        // If it is, then we need to check if it implements the IOP_721Receiver interface
        return this._transferFrom(from, to, tokenId);
    }

    // TODO: Allow for settin the base uri of nft.
    // Metadata methods

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

    // Events

    protected createTransferEvent(from: Address, to: Address, tokenId: u256): void {
        const transferEvent = new TransferEvent(from, to, tokenId);

        this.emitEvent(transferEvent);
    }

    protected createApprovalEvent(owner: Address, spender: Address, tokenId: u256): void {
        const approvalEvent = new ApprovalEvent(owner, spender, tokenId);

        this.emitEvent(approvalEvent);
    }

    protected createApprovalForAllEvent(
        owner: Address,
        operator: Address,
        approved: boolean,
    ): void {
        const approvalForAllEvent = new ApprovalForAllEvent(owner, operator, approved);

        this.emitEvent(approvalForAllEvent);
    }

    protected createMintEvent(to: Address, tokenId: u256): void {
        const mintEvent = new MintEvent(to, tokenId);

        this.emitEvent(mintEvent);
    }

    protected createBurnEvent(tokenId: u256): void {
        const burnEvent = new BurnEvent(tokenId);

        this.emitEvent(burnEvent);
    }
}
