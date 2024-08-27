import { BytesWriter, Calldata } from '@btc-vision/btc-runtime/runtime';

export interface IOP_165 {
  supportsInterface(calldata: Calldata): BytesWriter;
}