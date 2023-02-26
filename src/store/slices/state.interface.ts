import { IAppSlice } from "./game-slice";
import { INFTSlice } from "./NFt-slice";
import { IWinSlice } from "./play-slice";
export interface IReduxState {
    app: IAppSlice;
    nft: INFTSlice;
    fight: IWinSlice;
}
