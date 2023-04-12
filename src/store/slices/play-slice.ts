import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../state";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import { clearPendingTxn } from "./pending-txns-slice";
import axios from "axios";
import { setAll } from "../../helpers/set-all";
import { NILE_TESTNET } from "../../constants/addresses";
import tronWeb from "tronweb";

interface IenterRoomMeow {
  tokenId: number;
  fightRoom: number;
  whichroom: number;
  url: string;
  address: any;
  gamePrice: number;
}

declare var window: any;

export const EnterRoom = createAsyncThunk(
  "enterRoom/enterRoomMeow",

  async (
    {
      tokenId,
      fightRoom,
      whichroom,
      url,
      address,
      gamePrice,
    }: IenterRoomMeow,
    { dispatch }
  ) => {
    let meowContract;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(NILE_TESTNET.MEOW_ADDRESS));
      }
    }
    let enterTx;
    try {
      enterTx = await meowContract
        .enterRoom(tokenId, fightRoom)
        .send({ feeLimit: 100000000, callValue: gamePrice });

      let receipt = null;
      while (receipt === 'REVERT' || receipt == null) {
        if (window.tronWeb) {
          const transaction = await window.tronWeb.trx.getTransaction(enterTx);
          receipt = transaction.ret[0].contractRet;
        }
        if (receipt === 'REVERT') {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
        }
      }
      const random_tmp = ((await meowContract.randoms(fightRoom, 0).call())).toNumber();
      await axios.post(
        `http://13.57.204.10/api/betting/create?roomnum=${whichroom}&firstNFT=${url}&firstaddress=${address}&fightRoom=${fightRoom}&firstRandom=${random_tmp}&firstId=${tokenId}`
      );
      return;
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (enterTx) {
        dispatch(clearPendingTxn(enterTx.hash));
      }
    }
  }
);

interface IWidrawNFT {
  address: any
}

export const widrawNFT = createAsyncThunk(
  "widrawNFT/widrawNFT",

  async ({ address }: IWidrawNFT) => {
    let meowContract: any;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(NILE_TESTNET.MEOW_ADDRESS));
      }
    }
    let enterTx;
    let usersData: any;
    await axios
      .get(`http://13.57.204.10/api/userinfo/find?address=${address}`)
      .then((res) => {usersData = res.data;});

    try {
      enterTx = await meowContract.claimNFT(usersData.ownNfts).send({ feeLimit: 100000000 });
      let receipt = null;
      while (receipt === 'REVERT' || receipt == null) {
        if (window.tronWeb) {
          const transaction = await window.tronWeb.trx.getTransaction(enterTx);
          receipt = transaction.ret[0].contractRet;
        }
        if (receipt === 'REVERT') {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
      await axios.post(`http://13.57.204.10/api/userinfo/create?address=${address}&stakeAmount=${0}&claimAmount=0&ownNfts=[-1]`);
      return;
    } catch (err: any) {
      return;
    } finally {
    }
  }
);

interface IClaimMoney {
  address: any
}

export const claimMoney = createAsyncThunk(
  "claimMoney/claimMoney",

  async ({ address }: IClaimMoney) => {
    let meowContract: any;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(NILE_TESTNET.MEOW_ADDRESS));
      }
    }
    let enterTx;
    let usersData: any;
    await axios
      .get(`http://13.57.204.10/api/userinfo/find?address=${address}`)
      .then((res) => {usersData = res.data;});

    try {
      enterTx = await meowContract.claimMoney(usersData.claimAmount).send({ feeLimit: 100000000 });
      let receipt = null;
      while (receipt === 'REVERT' || receipt == null) {
        if (window.tronWeb) {
          const transaction = await window.tronWeb.trx.getTransaction(enterTx);
          receipt = transaction.ret[0].contractRet;
        }
        if (receipt === 'REVERT') {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
      await axios.post(`http://13.57.204.10/api/userinfo/create?address=${address}&stakeAmount=${0}&claimAmount=-1&ownNfts=[]`);
    } catch (err: any) {
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
    }: IclaimFightMeow,
    { dispatch }
  ) => {
    let meowContract: any;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(NILE_TESTNET.MEOW_ADDRESS));
      }
    }

    let enterTx;
    let random1: number[] = [];
    let random2: number[] = [];
    try {
      enterTx = await meowContract
      .claimFight(tokenId, fightRoom)
      .send({ feeLimit: 200000000, callValue: gamePrice });

      let receipt = null;
      while (receipt === 'REVERT' || receipt == null) {
        if (window.tronWeb) {
          const transaction = await window.tronWeb.trx.getTransaction(enterTx);
          receipt = transaction.ret[0].contractRet;
        }
        if (receipt === 'REVERT') {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
      const random_tmp = ((await meowContract.randoms(fightRoom, 1).call())).toNumber();

      axios.post(`http://13.57.204.10/api/betting/update?roomnum=${whichroom}&secondNFT=${url}&secondaddress=${address}&secondRandom=${random_tmp}&secondId=${tokenId}`);
      let firstrandom = waitingRandom;
      let secondrandom = random_tmp;
      random1[whichroom] = firstrandom;
      random2[whichroom] = secondrandom;

      let winnerData: any;
      let flag: boolean = false;
      let resultData: any;
      let usersData: any;

      await axios.post(`http://13.57.204.10/api/random/create?randomNumber1=${firstrandom}&randomNumber2=${secondrandom}&roomnum=${fightRoom}`);
      await axios
        .get(`http://13.57.204.10/api/betting/find?fightRoom=${fightRoom}`)
        .then((res) => {resultData = res.data;});
      const jackpotAmount = (await meowContract.jackpotAmount().call()).toNumber() / Math.pow(10, 6);
      await axios
        .get(`http://13.57.204.10/api/userinfo`)
        .then((res) => {usersData = res.data;});
      
      let totalStake = 0;
      for(let i = 0; i < usersData.length; i ++) {
        totalStake += usersData[i].stakeAmount;
      }
      if(firstrandom === 77777) {
        if(secondrandom === 77777) {
          await axios.post(`http://13.57.204.10/api/userinfo/create?address=${resultData.firstaddress}&stakeAmount=0&claimAmount=${jackpotAmount * 5 / 20}&ownNfts=[]`);
          await axios.post(`http://13.57.204.10/api/userinfo/create?address=${address}&stakeAmount=0&claimAmount=${jackpotAmount * 5 / 20}&ownNfts=[]`);
        } else {
          await axios.post(`http://13.57.204.10/api/userinfo/create?address=${resultData.firstaddress}&stakeAmount=0&claimAmount=${jackpotAmount * 4 / 10}&ownNfts=[]`);
          await axios.post(`http://13.57.204.10/api/userinfo/create?address=${address}&stakeAmount=0&claimAmount=${jackpotAmount * 1 / 10}&ownNfts=[]`);
        }
        
        for(let i = 0; i < usersData.length; i ++) {
          await axios.post(`http://13.57.204.10/api/userinfo/create?address=${usersData[i].address}&stakeAmount=0&claimAmount=${jackpotAmount * usersData[i].stakeAmount * 4 / totalStake / 10 }&ownNfts=[]`);
        }
        alert('You hit the Jackpot. Receive the award!!!!!');
        await meowContract.setJackpot(jackpotAmount / 10);
      }

      if(secondrandom === 77777) {
        if(firstrandom === 77777) {
          await axios.post(`http://13.57.204.10/api/userinfo/create?address=${resultData.firstaddress}&stakeAmount=0&claimAmount=${jackpotAmount * 5 / 20}&ownNfts=[]`);
          await axios.post(`http://13.57.204.10/api/userinfo/create?address=${address}&stakeAmount=0&claimAmount=${jackpotAmount * 5 / 20}&ownNfts=[]`);
        } else {
          await axios.post(`http://13.57.204.10/api/userinfo/create?address=${address}&stakeAmount=0&claimAmount=${jackpotAmount * 4 / 10}&ownNfts=[]`);
          await axios.post(`http://13.57.204.10/api/userinfo/create?address=${resultData.firstaddress}&stakeAmount=0&claimAmount=${jackpotAmount * 1 / 10}&ownNfts=[]`);
        }
        for(let i = 0; i < usersData.length; i ++) {
          await axios.post(`http://13.57.204.10/api/userinfo/create?address=${usersData[i].address}&stakeAmount=0&claimAmount=${jackpotAmount * usersData[i].stakeAmount * 4 / totalStake / 10 }&ownNfts=[]`);
        }
        alert('You hit the Jackpot. Receive the award!!!!!');
        await meowContract.setJackpot(jackpotAmount / 10);
      }

      if (firstrandom > secondrandom) {
        await axios
          .get(`http://13.57.204.10/api/winner/find?address=${resultData.firstaddress}`)
          .then((res) => {winnerData = res.data;});
          await axios.post(`http://13.57.204.10/api/userinfo/create?address=${resultData.firstaddress}&stakeAmount=0&claimAmount=${whichroom < 3 ? gamePrice * 6 / 5 : gamePrice * 6}&ownNfts=[${tokenId},${resultData.firstId}]`);
      } else if (firstrandom < secondrandom) {
        await axios
          .get(`http://13.57.204.10/api/winner/find?address=${address}`)
          .then((res) => {winnerData = res.data;});
          await axios.post(`http://13.57.204.10/api/userinfo/create?address=${address}&stakeAmount=0&claimAmount=${whichroom < 3 ? gamePrice * 6 / 5 : gamePrice * 6}&ownNfts=[${tokenId},${resultData.firstId}]`);
      } else {
        await axios.post(`http://13.57.204.10/api/userinfo/create?address=${resultData.firstaddress}&stakeAmount=0&claimAmount=${whichroom < 3 ? gamePrice : gamePrice * 5}&ownNfts=[${resultData.firstId}]`);
        await axios.post(`http://13.57.204.10/api/userinfo/create?address=${address}&stakeAmount=0&claimAmount=${whichroom < 3 ? gamePrice : gamePrice * 5}&ownNfts=[${tokenId}]`);
        flag = true;
      }

      if (winnerData) {
        await axios.post(`http://13.57.204.10/api/winner/update?address=${winnerData.address}&winCount=${winnerData.winCount + 1}`);
      } else {
        if (!flag) {
          if (firstrandom > secondrandom) {
            await axios.post(`http://13.57.204.10/api/winner/create?address=${resultData.firstaddress}&winCount=${1}`);
          } else if (firstrandom < secondrandom) {
            await axios.post(`http://13.57.204.10/api/winner/create?address=${address}&winCount=${1}`);
          }
        }
      }

      await axios.post(`http://13.57.204.10/api/result/create?randomNumber1=${firstrandom}&randomNumber2=${secondrandom}&nftUrl1=${resultData.firstNFT}&nftUrl2=${resultData.secondNFT}&address1=${resultData.firstaddress}&address2=${address}&roomnum=${fightRoom}`);

      return {
        random1,
        random2,
      };
    } catch (err: any) {
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
      .addCase(EnterRoom.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(EnterRoom.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(EnterRoom.rejected, (state, { error }) => {
        state.loading = false;
      })
      .addCase(widrawNFT.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(widrawNFT.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(widrawNFT.rejected, (state, { error }) => {
        state.loading = false;
      })
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

export const { fetchAppSuccess } = fightSlice.actions;

export const getAppState = createSelector(baseInfo, (fight) => fight);
