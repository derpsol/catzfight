import { IAppSlice } from "./game-slice";
import { INFTSlice } from "./NFt-slice";
import { IWinSlice } from "./play-slice";
import { INftDetailSlice } from "./Nftinfo-slice";
import { MessagesState } from "./messages-slice";
import { IWalletInfoDetail } from "./walletInfo-slice";
import { IBattleSlice } from "./battle-slice";
import { IJackPotSlice } from "./jackpot-slice";
import { IRandomSlice } from "./random-slice";
import { IResultSlice } from "./result-slice";
import { IWinnerSlice } from "./winner-slice";
import { IWaitingSlice } from "./getnft-slice";

export interface IReduxState {
    battle: IBattleSlice;
    app: IAppSlice;
    nft: INFTSlice;
    fight: IWinSlice;
    nfts: INftDetailSlice;
    messages: MessagesState;
    wallet: IWalletInfoDetail;
    jackpot: IJackPotSlice;
    random: IRandomSlice;
    result: IResultSlice;
    winner: IWinnerSlice;
    waiting: IWaitingSlice;
}
