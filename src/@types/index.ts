export type gameDataStyle = {
  roomNum: number;
  firstNFT: string;
  secondNFT: string;
  firstAddress: string;
  secondAddress: string;
  firstRandom: number;
  secondRandom: number;
  tokenId: number;
  fightRoom: number;
  nftAddress: string;
  nftName: string;
  createdAt: string;
  flag: boolean;
};

export type randomDataStyle = {
  roomNum: number;
  randomNumber1: number;
  randomNumber2: number;
}

export type resultDataStyle = {
  roomNum: number;
  randomNumber1: number;
  randomNumber2: number;
  nftUrl1: string;
  nftUrl2: string;
  address1: string;
  address2: string;
}

export type userinfoDataStyle = {
  address: string;
  stakeAmount: number;
  claimAmount: number;
  ownNfts: Array<number>;
}

export type winnerDataStyle = {
  address: string;
  winCount: number;
}