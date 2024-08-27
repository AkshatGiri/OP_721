import { BytesWriter, Calldata } from '@btc-vision/btc-runtime/runtime';

export interface IOP_721_Metadata {

  // TODO: QUESTION: is it possible to have functions with no calldata as an argument?
  name(): BytesWriter;

  symbol(): BytesWriter;

  tokenURI(calldata: Calldata): BytesWriter;

}