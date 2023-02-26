import { AbstractConnector } from "@web3-react/abstract-connector";

import { injected } from "../connectors";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  TRONLINK: {
    connector: injected,
    name: "TronLink",
    iconName: "tronlink.svg",
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#48489b",
  },
};

export const NetworkContextName = "NETWORK";

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

export * from "./blockchain";
export * from "./addresses";