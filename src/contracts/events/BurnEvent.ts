import { BytesWriter, Address, NetEvent } from '@btc-vision/btc-runtime/runtime';
import { u256 } from 'as-bignum/assembly';

@final
export class BurnEvent extends NetEvent {
  constructor(tokenId: u256) {
    const data: BytesWriter = new BytesWriter(1, true);
    data.writeU256(tokenId);

    super('Burn', data);
  }
}
