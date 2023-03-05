import { Networks } from "./blockchain";

export const NILE_TESTNET = {
  MEOW_ADDRESS: "TTEWgbh4wy2UQNFS2xroiH1XAYxdonReZ2", //
  NFT_ADDRESS: "TNmfgzNsuD4Xdv9oAFs3Nk6nJQdq826WL4",
  MEOWTOKEN_ADDRESS: "TJRyb1Rg4BAJCMd8cU5aCGfiTPxpY8FT1M",
};

export const getAddresses = (networkID: number) => {
  if (networkID === Networks.GOERLI) return NILE_TESTNET;

  throw Error("Network don't support");
};
