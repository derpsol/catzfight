import { Box, Button, Skeleton, Tab, Tabs } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Modal from "@mui/material/Modal";
import { avatarsStyle, modalAvatarStyle, style } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "state";
import { loadBattleDetails } from "store/slices/battle-slice";
import { IReduxState } from "store/slices/state.interface";
import { useCallback, useState } from "react";
import { approveNFT, loadNftAllowance } from "store/slices/NFt-slice";
import { getDate } from "./getDate";
import { EnterRoom } from "store/slices/enter-room-slice";
import { useWeb3React } from "@web3-react/core";

export function SampleModal() {
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const { account } = useWeb3React();
  const nftids: any[][] = useSelector<IReduxState, any[][]>(
    (state) => state.nfts.nftids
  );
  const nfturis: any[][] = useSelector<IReduxState, any[][]>(
    (state) => state.nfts.nfturis
  );
  const baseUri: string[] = useSelector<IReduxState, string[]>(
    (state) => state.nfts.nfturl
  );
  const approvedList: any[] = useSelector<IReduxState, any[]>(
    (state) => state.nfts.approvedList
  );
  const isLoading: boolean = useSelector<IReduxState, boolean>(
    (state) => state.nft.loading
  );
  const allowFlg: boolean[][] = useSelector<IReduxState, boolean[][]>(
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

  const handleApproveNFT = useCallback(
    async (id: Number, index: number, address: string) => {
      await dispatch(
        approveNFT({
          tokenId: id,
          address: address,
        })
      );
      await dispatch(loadNftAllowance({ tokenIds: nftids[index], index: index }));
    },
    [nftids]
  );

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
    },
    [gamePrice, baseUri, account, whichroom]
  );

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
        <TabContext value={value}>
          <TabList onChange={handleChange}>
            <Tabs variant="scrollable" scrollButtons allowScrollButtonsMobile>
              {approvedList?.map((approve, index) => {
                return (
                  <Tab
                    label={approve.name}
                    value={`${index + 1}`}
                    sx={{
                      color: "white",
                      fontSize: "18px",
                      backgroundColor: "#111",
                      mr: "8px",
                    }}
                    key={index}
                  />
                );
              })}
            </Tabs>
          </TabList>
          {approvedList?.map((approve, index) => {
            return (
              <TabPanel value={`${index + 1}`} key={index} >
                <Box sx={avatarsStyle}>
                  {nftInfo &&
                    nftInfo.map((id: number, index0) => {
                      return (
                        <Box
                          sx={{
                            m: 2,
                            display: "flex",
                            flexDirection: "column",
                          }}
                          key={index0}
                        >
                          <Box
                            sx={{
                              mb: 2,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Box
                              component="img"
                              src={`https://ipfs.io/ipfs/${baseUri[index0]?.slice(
                                7,
                                53
                              )}/${id}.png`}
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
                  {nftids[index] &&
                    nftids[index].map((id: number, index1) => {
                      return (
                        <Box
                          sx={{
                            m: 2,
                            display: "flex",
                            flexDirection: "column",
                          }}
                          key={index1}
                        >
                          <Box
                            sx={{
                              mb: 2,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {nfturis[index] ? (
                              <Box
                                component="img"
                                src={nfturis[index]?.[index1]}
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
                                allowFlg?.[index][index1]
                                  ? () => {
                                      onEnterRoom(id);
                                      closeModal();
                                    }
                                  : () => handleApproveNFT(id, index, approve.address)
                              }
                            >
                              {allowFlg?.[index][index1] ? "Fight" : "Approve"}
                            </Button>
                          )}
                        </Box>
                      );
                    })}
                </Box>
              </TabPanel>
            );
          })}
        </TabContext>
      </Box>
    </Modal>
  );
}
