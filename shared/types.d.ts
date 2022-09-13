import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export type Path = "PoW->PoS" | "PoS->PoW";

export type NativeCurrency = {
  name: string;
  symbol: string; // 2-6 characters long
  decimals: 18;
};
