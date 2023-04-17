import { Box, Button, Skeleton } from "@mui/material";
import Modal from "@mui/material/Modal";
import { modalAvatarStyle, style } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "state";
import { loadBattleDetails } from "store/slices/battle-slice";
import { IReduxState } from "../../store/slices/state.interface";
import { useCallback, useEffect } from "react";
import { approveNFT, loadNftAllowance } from "store/slices/NFt-slice";
import { getDate } from "./getDate";
import { EnterRoom } from "store/slices/play-slice";
import { useWeb3React } from "@web3-react/core";

export function SampleModal() {
  const dispatch = useDispatch<AppDispatch>();
  const { account } = useWeb3React();
  const nftids: any[] = useSelector<IReduxState, any[]>(
    (state) => state.nfts.nftids
  );
  const nfturis: any[] = useSelector<IReduxState, any[]>(
    (state) => state.nfts.nfturis
  );
  const isLoading: boolean = useSelector<IReduxState, boolean>(
    (state) => state.nft.loading
  );
  const allowFlg: boolean[] = useSelector<IReduxState, boolean[]>(
    (state) => state.nft.allowances
  );
  const openState: boolean = useSelector<IReduxState, boolean>(
    (state) => state.battle.openState
  );
  const whichroom: number = useSelector<IReduxState, number>(
    (state) => state.battle.whichroom
  );
  const gamePrice: string = useSelector<IReduxState, string>(
    (state) => state.app.gameprice
  );

  useEffect(() => {
    if(isLoading){
      dispatch(loadNftAllowance({ tokenIds: nftids }));
    }
  }, [isLoading])

  const approve = useCallback(async (id: Number) => {
    await dispatch(
      approveNFT({
        tokenId: id,
      })
    );
    await dispatch(loadNftAllowance({ tokenIds: nftids }));
  }, []);

  const closeModal = useCallback(async () => {
    dispatch(
      loadBattleDetails({
        openState: false,
        claimState: false,
        whichroom: 0,
        whichfight: 0,
        waitingRandom: 0,
        decide: false,
      })
    );
  }, []);

  const onEnterRoom = useCallback(async(index: number) => {
    let fightRoomnum = getDate();
    await dispatch(EnterRoom({
      tokenId: nftids[index],
      fightRoom: fightRoomnum,
      whichroom: whichroom,
      url: nfturis[index],
      address: account,
      gamePrice: Number(gamePrice),
    }));
  }, [nftids, nfturis]);

  return (
    <Modal
      open={openState}
      onClose={() => {
        closeModal();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {nftids &&
          nftids.map((id: Number, index) => {
            return (
              <Box
                sx={{ m: 2, display: "flex", flexDirection: "column" }}
                key={index}
              >
                <Box sx={{ mb: 2, display: "flex", flexDirection: "column" }}>
                  {nfturis ? (
                    <Box
                      component="img"
                      src={nfturis?.[index]}
                      alt="NFT_avatar"
                      sx={modalAvatarStyle}
                    />
                  ) : (
                    <Skeleton sx={modalAvatarStyle} />
                  )}
                </Box>
                {isLoading ? (
                  <Skeleton height="36px" />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={
                      allowFlg?.[index]
                        ? () => {
                            onEnterRoom(index);
                            closeModal();
                          }
                        : () => approve(id)
                    }
                  >
                    {allowFlg?.[index] ? "Fight" : "Approve"}
                  </Button>
                )}
              </Box>
            );
          })}
      </Box>
    </Modal>
  );
}