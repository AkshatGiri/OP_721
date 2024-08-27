import { BytesWriter, Calldata } from '@btc-vision/btc-runtime/runtime';

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