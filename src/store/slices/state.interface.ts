import { IAppSlice } from "./game-slice";
import { INFTSlice } from "./NFt-slice";
import { IWinSlice } from "./play-slice";
import { INftDetailSlice } from "./Nftinfo-slice";
import { MessagesState } from "./messages-slice";
import { IWalletInfoDetail } from "./walletInfo-slice";
import { IBattleSlice } from "./battle-slice";
export interface IReduxState {
    battle: IBattleSlice;
    app: IAppSlice;
    nft: INFTSlice;
    fight: IWinSlice;
    nfts: INftDetailSlice;
    messages: MessagesState;
    wallet: IWalletInfoDetail;
}
