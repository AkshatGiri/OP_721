import { BytesWriter, Calldata } from '@btc-vision/btc-runtime/runtime';
import { calculateInterfaceId } from '../utils/calculateInterfaceId';

export interface IOP_721 {
  balanceOf(calldata: Calldata): BytesWriter;

  ownerOf(calldata: Calldata): BytesWriter;

  safeTransferFrom(calldata: Calldata): BytesWriter;

  transferFrom(calldata: Calldata): BytesWriter;

  approve(calldata: Calldata): BytesWriter;

  setApprovalForAll(calldata: Calldata): BytesWriter;

  getApproved(calldata: Calldata): BytesWriter;

  isApprovedForAll(calldata: Calldata): BytesWriter;
}

export const INTERFACE_ID_OP_721 = calculateInterfaceId([
  'balanceOf',
  'ownerOf',
  'safeTransferFrom',
  'transferFrom',
  'approve',
  'setApprovalForAll',
  'getApproved',
  'isApprovedForAll',
]);
