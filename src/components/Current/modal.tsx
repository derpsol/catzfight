import { Box, Button, Skeleton } from "@mui/material";
import Modal from "@mui/material/Modal";
import { avatarsStyle, modalAvatarStyle, style } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "state";
import { loadBattleDetails } from "store/slices/battle-slice";
import { IReduxState } from "store/slices/state.interface";
import { useCallback, useEffect } from "react";
import { approveNFT, loadNftAllowance } from "store/slices/NFt-slice";
import { getDate } from "./getDate";
import { EnterRoom } from "store/slices/enter-room-slice";
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
    (state) => state.jackpot.gameprice
  );
  const nftInfo: number[] = useSelector<IReduxState, number[]>(
    (state) => state.wallet.nftInfo
  );
  const baseUri: string = useSelector<IReduxState, string>(
    (state) => state.nfts.nfturl
  );

  useEffect(() => {
    if (isLoading) {
      dispatch(loadNftAllowance({ tokenIds: nftids }));
    }
  }, [isLoading, nftids]);

  const approve = useCallback(async (id: Number) => {
    await dispatch(
      approveNFT({
        tokenId: id,
      })
    );
    await dispatch(loadNftAllowance({ tokenIds: nftids }));
  }, [nftids]);

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

  const onEnterRoom = useCallback(
    async (id: number) => {
      let fightRoomNum = getDate();
      await dispatch(
        EnterRoom({
          tokenId: id,
          fightRoom: fightRoomNum,
          whichroom: whichroom,
          url: `https://ipfs.io/ipfs/${baseUri?.slice(7, 53)}/${id}.png`,
          address: account,
          gamePrice: Number(gamePrice),
        })
      );
    }, [gamePrice, baseUri, account, whichroom]);

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
        <Box sx={avatarsStyle}>
          {nftInfo &&
            nftInfo.map((id: number, index) => {
              return (
                <Box
                  sx={{ m: 2, display: "flex", flexDirection: "column" }}
                  key={index}
                >
                  <Box sx={{ mb: 2, display: "flex", flexDirection: "column" }}>
                    <Box
                      component="img"
                      src={`https://ipfs.io/ipfs/${baseUri?.slice(7,53)}/${id}.png`}
                      alt="NFT_avatar"
                      sx={modalAvatarStyle}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      onEnterRoom(id);
                      closeModal();
                    }}
                  >
                    Fight
                  </Button>
                </Box>
              );
            })}
        </Box>
        <Box sx={avatarsStyle}>
          {nftids &&
            nftids.map((id: number, index) => {
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
                              onEnterRoom(id);
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
      </Box>
    </Modal>
  );
}
