import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "state";
import { clearPendingTxn } from "./pending-txns-slice";
import { setAll } from "helpers/set-all";
import { SHASTA_TESTNET } from "constants/addresses";
import tronWeb from "tronweb";
import io from "socket.io-client";
import { notification } from "utils/notification";
import instance from "constants/axios";
import { baseURL } from 'constants/axios'

declare var window: any;
const socket = io(baseURL);

interface IWidrawNFT {
  address: any;
}

export const widrawNFT = createAsyncThunk(
  "widrawNFT/widrawNFT",

  async ({ address }: IWidrawNFT) => {
    let meowContract: any;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(SHASTA_TESTNET.MEOW_ADDRESS));
      }
    }
    let usersData: any;
    await instance
      .get(`/api/userinfo/find?address=${address}`)
      .then((response) => {
        usersData = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    
    let nftIds: number[] = [];
    let nftAddress: string[] = [];

    for(let i = 0; i < usersData.ownNfts.length; i ++) {
      nftAddress[i] = usersData.ownNfts[i].split('@')[0];
      nftIds[i] = Number(usersData.ownNfts[i].split('@')[1]);
    }

    try {
      await meowContract
        .claimNFT(nftIds, nftAddress)
        .send({ feeLimit: 100000000 });

      await instance.post("/api/userinfo/create", {
        address: address,
        stakeAmount: 0,
        claimAmount: 0,
        ownNfts: [-1],
      });
      notification({ title: "Successfully Withdrew!", type: "success" });
      socket.emit("enter");
      return;
    } catch (err: any) {
      notification({ title: `${err}`, type: "danger" });
      return;
    } finally {
    }
  }
);

interface IClaimMoney {
  address: any;
}

export const claimMoney = createAsyncThunk(
  "claimMoney/claimMoney",

  async ({ address }: IClaimMoney) => {
    let meowContract: any;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(SHASTA_TESTNET.MEOW_ADDRESS));
      }
    }
    let usersData: any;
    await instance
      .get(`/api/userinfo/find?address=${address}`)
      .then((response) => {
        usersData = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    try {
      await meowContract
        .claimMoney(usersData.claimAmount)
        .send({ feeLimit: 100000000 });
      await instance.post("/api/userinfo/create", {
        address: address,
        stakeAmount: 0,
        claimAmount: -1,
        ownNfts: [],
      });

      notification({ title: "Successfully Withdrew!", type: "success" });
      socket.emit("enter");
    } catch (err: any) {
      notification({ title: `${err}`, type: "danger" });
      return;
    } finally {
    }
  }
);

interface IclaimFightMeow {
  tokenId: number;
  fightRoom: number;
  whichroom: number;
  url: string;
  waitingRandom: number;
  address: any;
  gamePrice: number;
  nftAddress: string;
}

export const ClaimFight = createAsyncThunk(
  "claimfight/claimfightMeow",

  async (
    {
      tokenId,
      fightRoom,
      whichroom,
      url,
      waitingRandom,
      address,
      gamePrice,
      nftAddress
    }: IclaimFightMeow,
    { dispatch }
  ) => {
    let meowContract: any;
    console.log('claimFight Data: ', tokenId, fightRoom, whichroom, url, waitingRandom, address, gamePrice);
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(SHASTA_TESTNET.MEOW_ADDRESS));
      }
    }

    let enterTx;
    let random1: number[] = [];
    let random2: number[] = [];
    try {
      enterTx = await meowContract
        .claimFight(tokenId, fightRoom, nftAddress)
        .send({ feeLimit: 200000000, callValue: gamePrice });

      let receipt = null;
      while (receipt === "REVERT" || receipt == null) {
        if (window.tronWeb) {
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const transaction = await window.tronWeb.trx.getTransaction(enterTx);
          if (transaction && transaction.ret && transaction.ret.length > 0) {
            receipt = transaction.ret[0].contractRet;
          }
          console.log("receipt: ", receipt, enterTx);
        }
        if (receipt === "REVERT") {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
        }
      }

      const random_tmp = (
        await meowContract.randoms(fightRoom, 1).call()
      ).toNumber();
      console.log('whichroom: ', whichroom);
      await instance.post("/api/betting/update", {
        roomNum: whichroom,
        secondNFT: url,
        secondAddress: address,
        secondRandom: random_tmp,
        secondId: tokenId,
      });

      let firstRandom = waitingRandom;
      let secondRandom = random_tmp;
      random1[whichroom] = firstRandom;
      random2[whichroom] = secondRandom;

      let winnerData: any;
      let flag: boolean = false;
      let resultData: any;
      let usersData: any;
      await instance.post("/api/random/create", {
        randomNumber1: firstRandom,
        randomNumber2: secondRandom,
        roomNum: fightRoom,
      });

      await instance
        .get(`/api/betting/find?fightRoom=${fightRoom}`)
        .then((response) => {
          resultData = response.data;
        })
        .catch((error) => {
          console.log(error);
        });

      const jackpotAmount =
        (await meowContract.jackpotAmount().call()).toNumber() /
        Math.pow(10, 6);

      await instance
        .get(`/api/userinfo`)
        .then((response) => {
          usersData = response.data;
        })
        .catch((error) => {
          console.log(error);
        });

      let totalStake = 0;
      for (let i = 0; i < usersData.length; i++) {
        totalStake += usersData[i].stakeAmount;
      }
      if (firstRandom === 777) {
        if (secondRandom === 777) {
          await instance.post("/api/userinfo/create", {
            address: resultData.firstAddress,
            stakeAmount: 0,
            claimAmount: (jackpotAmount * 5) / 20,
            ownNfts: [],
          });

          await instance.post("/api/userinfo/create", {
            address: address,
            stakeAmount: 0,
            claimAmount: (jackpotAmount * 5) / 20,
            ownNfts: [],
          });
        } else {
          await instance.post("/api/userinfo/create", {
            address: resultData.firstAddress,
            stakeAmount: 0,
            claimAmount: (jackpotAmount * 4) / 10,
            ownNfts: [],
          });

          await instance.post("/api/userinfo/create", {
            address: address,
            stakeAmount: 0,
            claimAmount: (jackpotAmount * 1) / 10,
            ownNfts: [],
          });
        }

        for (let i = 0; i < usersData.length; i++) {
          await instance.post("/api/userinfo/create", {
            address: usersData[i].address,
            stakeAmount: 0,
            claimAmount:
              (jackpotAmount * usersData[i].stakeAmount * 4) / totalStake / 10,
            ownNfts: [],
          });
        }
        alert("You hit the Jackpot. Receive the award!!!!!");
        await meowContract.setJackpot(jackpotAmount / 10);
      }

      if (secondRandom === 777) {
        if (firstRandom === 777) {
          await instance.post("/api/userinfo/create", {
            address: resultData.firstAddress,
            stakeAmount: 0,
            claimAmount: (jackpotAmount * 5) / 20,
            ownNfts: [],
          });

          await instance.post("/api/userinfo/create", {
            address: address,
            stakeAmount: 0,
            claimAmount: (jackpotAmount * 5) / 20,
            ownNfts: [],
          });
        } else {
          await instance.post("/api/userinfo/create", {
            address: address,
            stakeAmount: 0,
            claimAmount: (jackpotAmount * 4) / 20,
            ownNfts: [],
          });

          await instance.post("/api/userinfo/create", {
            address: resultData.firstAddress,
            stakeAmount: 0,
            claimAmount: (jackpotAmount * 1) / 20,
            ownNfts: [],
          });
        }
        for (let i = 0; i < usersData.length; i++) {
          await instance.post("/api/userinfo/create", {
            address: usersData[i].address,
            stakeAmount: 0,
            claimAmount:
              (jackpotAmount * usersData[i].stakeAmount * 4) / totalStake / 10,
            ownNfts: [],
          });
        }
        alert("You hit the Jackpot. Receive the award!!!!!");
        await meowContract.setJackpot(jackpotAmount / 10);
      }

      if (firstRandom > secondRandom) {
        await instance
          .get(`/api/winner/find?address=${resultData.firstAddress}`)
          .then((response) => {
            winnerData = response.data;
          })
          .catch((error) => {
            console.log(error);
          });

        await instance.post("/api/userinfo/create", {
          address: resultData.firstAddress,
          stakeAmount: 0,
          claimAmount: whichroom < 3 ? (gamePrice * 6) / 5 : gamePrice * 6,
          ownNfts: [`${nftAddress}@${tokenId}`, `${nftAddress}@${resultData.tokenId}`],
        });
      } else if (firstRandom < secondRandom) {
        await instance
          .get(`/api/winner/find?address=${address}`)
          .then((response) => {
            winnerData = response.data;
          })
          .catch((error) => {
            console.log(error);
          });

        await instance.post("/api/userinfo/create", {
          address: address,
          stakeAmount: 0,
          claimAmount: whichroom < 3 ? (gamePrice * 6) / 5 : gamePrice * 6,
          ownNfts: [`${nftAddress}@${tokenId}`, `${nftAddress}@${resultData.tokenId}`],
        });
      } else {
        await instance.post("/api/userinfo/create", {
          address: resultData.firstAddress,
          stakeAmount: 0,
          claimAmount: whichroom < 3 ? gamePrice : gamePrice * 5,
          ownNfts: [`${nftAddress}@${resultData.tokenId}`],
        });

        await instance.post("/api/userinfo/create", {
          address: address,
          stakeAmount: 0,
          claimAmount: whichroom < 3 ? gamePrice : gamePrice * 5,
          ownNfts: [`${nftAddress}@${tokenId}`],
        });
        flag = true;
      }

      if (winnerData) {
        await instance.post("/api/winner/update", {
          address: winnerData.address,
          winCount: winnerData.winCount + 1,
        });
      } else {
        if (!flag) {
          if (firstRandom > secondRandom) {
            await instance.post("/api/winner/create", {
              address: winnerData.address,
              winCount: 1,
            });
          } else if (firstRandom < secondRandom) {
            await instance.post("/api/winner/create", {
              address: address,
              winCount: 1,
            });
          }
        }
      }

      await instance.post("/api/result/create", {
        randomNumber1: firstRandom,
        randomNumber2: secondRandom,
        nftUrl1: resultData.firstNFT,
        nftUrl2: resultData.secondNFT,
        address1: resultData.firstAddress,
        address2: resultData.secondAddress,
        roomNum: fightRoom
      });

      notification({ title: "Successfully Entered!", type: "success" });
      return {
        random1,
        random2,
      };
    } catch (err: any) {
      notification({ title: `${err}`, type: "danger" });
    } finally {
      if (enterTx) {
        dispatch(clearPendingTxn(enterTx));
      }
    }
  }
);

const initialState = {
  loading: true,
};

export interface IWinSlice {
  random1: number[];
  random2: number[];
}

const fightSlice = createSlice({
  name: "fight",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      // console.log(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ClaimFight.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(ClaimFight.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(ClaimFight.rejected, (state, { error }) => {
        state.loading = false;
      });
  },
});

const baseInfo = (state: RootState) => state.fight;

export default fightSlice.reducer;

export const getAppState = createSelector(baseInfo, (fight) => fight);
