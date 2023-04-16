import { Networks } from "./blockchain";

export const SHASTA_TESTNET = {
  MEOW_ADDRESS: "TWoPVmCzgW9HUndCvnjzMx46yixdi3GHMX", //
  NFT_ADDRESS: "TUvR3L8eT3QPDJ18hVUqELzpvVQrGL2gAM",
  MEOWTOKEN_ADDRESS: "TDtFwTisg9hdsfmwEGcZcyCTExExsdazFj",
};

export const getAddresses = (networkID: number) => {
  if (networkID === Networks.GOERLI) return SHASTA_TESTNET;

  throw Error("Network don't support");
};
