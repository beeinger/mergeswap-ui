import { Chain } from "@usedapp/core";
import { providers } from "ethers";

export type ChainPlus = Chain & {
  provider: providers.JsonRpcProvider;
};

export const PoW: ChainPlus = {
  chainId: 10001,
  chainName: "ETHW-mainnet",
  isTestChain: false,
  isLocalChain: false,
  multicallAddress: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
  getExplorerAddressLink: (address: string) =>
    `https://mainnet.ethwscan.com/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `https://mainnet.ethwscan.com/tx/${transactionHash}`,
  provider: new providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_POW_HTTP_PROVIDER
  ),
  // Optional parameters:
  rpcUrl: process.env.NEXT_PUBLIC_POW_HTTP_PROVIDER,
  blockExplorerUrl: "https://mainnet.ethwscan.com",
  nativeCurrency: {
    name: "ETHW",
    symbol: "ETHW",
    decimals: 18,
  },
};

export const PoS: ChainPlus = {
  chainId: 1,
  chainName: "Ethereum Mainnet",
  isTestChain: false,
  isLocalChain: false,
  multicallAddress: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
  getExplorerAddressLink: (address: string) =>
    `https://etherscan.io/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `https://etherscan.io/tx/${transactionHash}`,
  provider: new providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_POS_HTTP_PROVIDER
  ),
  // Optional parameters:
  rpcUrl: process.env.NEXT_PUBLIC_POS_HTTP_PROVIDER,
  blockExplorerUrl: "https://etherscan.io",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
};
