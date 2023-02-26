import { Networks } from "./blockchain";

const GOERLI_TESTNET = {
  MEOW_ADDRESS: "TGCipcjY4ptZw6jUAz5tGEJ59in7avuW4M", //
  NFT_ADDRESS: "TNmfgzNsuD4Xdv9oAFs3Nk6nJQdq826WL4",
  MEOWTOKEN_ADDRESS: "TJRyb1Rg4BAJCMd8cU5aCGfiTPxpY8FT1M",
};

export const getAddresses = (networkID: number) => {
  if (networkID === Networks.GOERLI) return GOERLI_TESTNET;

  throw Error("Network don't support");
};
