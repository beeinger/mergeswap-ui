import { Chain } from "@usedapp/core";
import { providers } from "ethers";

export type ChainPlus = Chain & {
  provider: providers.JsonRpcProvider;
};

export const PoW: ChainPlus = {
  chainId: 5,
  chainName: "Goerli Test Network",
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: "0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e",
  getExplorerAddressLink: (address: string) =>
    `https://goerli.etherscan.io/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `https://goerli.etherscan.io/tx/${transactionHash}`,
  provider: new providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_POW_HTTP_PROVIDER
  ),
  // Optional parameters:
  rpcUrl: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  blockExplorerUrl: "https://goerli.etherscan.io",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
};

export const PoS: ChainPlus = {
  chainId: 80001,
  chainName: "Mumbai",
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: "0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc",
  getExplorerAddressLink: (address: string) =>
    `https://mumbai.polygonscan.com/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `https://mumbai.polygonscan.com/tx/${transactionHash}`,
  provider: new providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_POS_HTTP_PROVIDER
  ),
  // Optional parameters:
  rpcUrl: "https://matic-mumbai.chainstacklabs.com",
  blockExplorerUrl: "https://mumbai.polygonscan.com",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
};
