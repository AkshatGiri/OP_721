import { BytesWriter, Address, NetEvent } from '@btc-vision/btc-runtime/runtime';
import { u256 } from 'as-bignum/assembly';

@final
export class ApprovalEvent extends NetEvent {
  constructor(owner: Address, spender: Address, tokenId: u256) {
    const data: BytesWriter = new BytesWriter(1, true);
    data.writeAddress(owner);
    data.writeAddress(spender);
    data.writeU256(tokenId);

    super('Approval', data);
  }
}
