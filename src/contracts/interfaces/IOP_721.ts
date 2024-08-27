import { StoredU256, Calldata, BytesWriter } from '@btc-vision/btc-runtime/runtime'
import { IOP_165 } from './IOP_165'

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