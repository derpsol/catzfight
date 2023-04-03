import { IAppSlice } from "./game-slice";
import { INFTSlice } from "./NFt-slice";
import { IWinSlice } from "./play-slice";
import { INftDetailSlice } from "./Nftinfo-slice";
import { IWalletInfoDetail } from "./walletInfo-slice";
export interface IReduxState {
    app: IAppSlice;
    nft: INFTSlice;
    fight: IWinSlice;
    nfts: INftDetailSlice;
    wallet: IWalletInfoDetail;
}
