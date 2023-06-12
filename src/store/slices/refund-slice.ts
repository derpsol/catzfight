import { createAsyncThunk } from "@reduxjs/toolkit";
import { metamaskErrorWrap } from "helpers/metamask-error-wrap";
import { SHASTA_TESTNET } from "constants/addresses";
import tronWeb from "tronweb";
import { notification } from "utils/notification";

interface IrefundRoom {
  tokenId: Number;
  nftAddress: string;
  fighterAddress: string;
}

declare var window: any;

export const refundRoom = createAsyncThunk(
  "refund/refundRoom",
  //@ts-ignore
  async (
    { tokenId, nftAddress, fighterAddress }: IrefundRoom,
    { dispatch }
  ) => {
    let meowContract;
    if (window) {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        meowContract = await window.tronWeb
          .contract()
          .at(tronWeb.address.toHex(SHASTA_TESTNET.MEOW_ADDRESS));
      }
    }
    try {
      let enterTx = await meowContract
        .refundFight(tokenId, fighterAddress, nftAddress)
        .send({ feeLimit: 100000000 });

      let receipt = null;
      while (receipt === "REVERT" || receipt == null) {
        if (window.tronWeb) {
          await new Promise((resolve) => setTimeout(resolve, 1000));

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

      notification({ title: "Successfully Refunded!", type: "success" });
      return;
    } catch (err: any) {
      notification({ title: `${err}`, type: "danger" });
      return metamaskErrorWrap(err, dispatch);
    } finally {
    }
  }
);
