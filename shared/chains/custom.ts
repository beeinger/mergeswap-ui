import { Chain } from "@usedapp/core";

export const PoW: Chain = {
  chainId: 5,
  chainName: "Goerli Test Network",
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: "0x0000000000000000000000000000000000000000",
  getExplorerAddressLink: (address: string) =>
    `https://goerli.etherscan.io/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `https://goerli.etherscan.io/tx/${transactionHash}`,
  // Optional parameters:
  rpcUrl: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  blockExplorerUrl: "https://goerli.etherscan.io",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
};

export const PoS: Chain = {
  chainId: 80001,
  chainName: "Mumbai",
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: "0x0000000000000000000000000000000000000000",
  getExplorerAddressLink: (address: string) =>
    `https://mumbai.polygonscan.com/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `https://mumbai.polygonscan.com/tx/${transactionHash}`,
  // Optional parameters:
  rpcUrl: 'https://matic-mumbai.chainstacklabs.com"',
  blockExplorerUrl: "https://mumbai.polygonscan.com",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
};