import { BytesWriter, Calldata } from '@btc-vision/btc-runtime/runtime';
import { calculateInterfaceId } from '../utils/calculateInterfaceId';

export interface IOP_165 {
  supportsInterface(calldata: Calldata): BytesWriter;
}

// QUESTION: should we include the inputs in the interface id calculation?
// Or would the function signature suffice?
export const INTERFACE_ID_OP_165 = calculateInterfaceId([
  'supportsInterface'
])