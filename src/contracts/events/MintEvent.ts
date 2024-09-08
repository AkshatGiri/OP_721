import { BytesWriter, Address, NetEvent } from '@btc-vision/btc-runtime/runtime';
import { u256 } from 'as-bignum/assembly';

@final
export class MintEvent extends NetEvent {
  constructor(to: Address, tokenId: u256) {
    const data: BytesWriter = new BytesWriter(1, true);
    data.writeAddress(to);
    data.writeU256(tokenId);

    super('Mint', data);
  }
}
