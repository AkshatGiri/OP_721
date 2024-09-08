import { BytesWriter, Address, NetEvent } from '@btc-vision/btc-runtime/runtime';
import { u256 } from 'as-bignum/assembly';

@final
export class TransferEvent extends NetEvent {
  constructor(from: Address, to: Address, tokenId: u256) {
    const data: BytesWriter = new BytesWriter(1, true);
    data.writeAddress(from);
    data.writeAddress(to);
    data.writeU256(tokenId);

    super('Transfer', data);
  }
}
