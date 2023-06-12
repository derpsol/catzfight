import { createAsyncThunk } from "@reduxjs/toolkit";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import { clearPendingTxn } from "./pending-txns-slice";
import { SHASTA_TESTNET } from "constants/addresses";
import tronWeb from "tronweb";
import { notification } from "utils/notification";
import instance from "constants/axios";

interface IenterRoomMeow {
  tokenId: number;
  fightRoom: number;
  whichroom: number;
  url: string;
  address: any;
  gamePrice: number;
  nftAddress: string;
  nftName: string;
}

declare var window: any;

export const EnterRoom = createAsyncThunk(
  "enterRoom/enterRoomMeow",
  async (
    { tokenId, fightRoom, whichroom, url, address, gamePrice, nftAddress, nftName }: IenterRoomMeow,
    { dispatch }
  ) => {
    console.log('enterRoom data: ', tokenId, fightRoom, whichroom, url, nftAddress, gamePrice);
    let meowContract;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(SHASTA_TESTNET.MEOW_ADDRESS));
      }
    }
    let enterTx;
    try {
      enterTx = await meowContract
        .enterRoom(tokenId, fightRoom, nftAddress)
        .send({ feeLimit: 2000000000, callValue: gamePrice });

      let receipt = null;
      let attempts = 0;
      while ((receipt === "REVERT" || receipt == null) && attempts < 1000) {
        // give up after 10 attempts
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
        attempts++;
      }
      const random_tmp = (
        await meowContract.randoms(fightRoom, 0).call()
      ).toNumber();
      await instance.post("/api/betting/create", {
        roomNum: whichroom,
        firstNFT: url,
        firstAddress: address,
        fightRoom: fightRoom,
        firstRandom: random_tmp,
        tokenId: tokenId,
        nftAddress: nftAddress,
        nftName: nftName,
      });
      notification({ title: "Successfully Entered!", type: "success" });
      return;
    } catch (err: any) {
      notification({ title: `${err}`, type: "danger" });
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (enterTx) {
        dispatch(clearPendingTxn(enterTx.hash));
      }
    }
  }
);
