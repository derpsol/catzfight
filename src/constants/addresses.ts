import { Networks } from "./blockchain";

export const SHASTA_TESTNET = {
  MEOW_ADDRESS: "TQpb8ACUEDMqF4Dy4JrNZAeuAW5aJrqUWu", //
  NFT_ADDRESS: "TUvR3L8eT3QPDJ18hVUqELzpvVQrGL2gAM",
  MEOWTOKEN_ADDRESS: "TDtFwTisg9hdsfmwEGcZcyCTExExsdazFj",
};

export const getAddresses = (networkID: number) => {
  if (networkID === Networks.GOERLI) return SHASTA_TESTNET;

  throw Error("Network don't support");
};
