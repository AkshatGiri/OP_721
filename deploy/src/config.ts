import {
    OPNetLimitedProvider,
    TransactionFactory,
    Wallet,
} from '@btc-vision/transaction';

import { networks } from 'bitcoinjs-lib';
import { BitcoinRPC } from '@btc-vision/bsi-bitcoin-rpc';
import { ABICoder } from '@btc-vision/bsi-binary';

const OPNET_PROVIDER = 'https://regtest.opnet.org';
const network = networks.regtest;

export const Configs = {
    OPNET_PROVIDER: OPNET_PROVIDER,
    NETWORK: network,
    LIMITED_PROVIDER: new OPNetLimitedProvider(OPNET_PROVIDER),
    WALLET: Wallet.fromWif("YOUR PRIVATE KEY HERE", network),
    FACTORY: new TransactionFactory(),
    RPC: new BitcoinRPC(),
    ABI_CODER: new ABICoder(),
};
