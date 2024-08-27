import { StoredU256, Calldata, BytesWriter } from '@btc-vision/btc-runtime/runtime'

export interface IOP_165 {
  supportsInterface(calldata: Calldata): BytesWriter;
}