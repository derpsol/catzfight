import { Box, Button, Skeleton, Tabs, Tab } from "@mui/material";
import Modal from "@mui/material/Modal";
import { avatarsStyle, modalAvatarStyle, style } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "state";
import { loadBattleDetails } from "store/slices/battle-slice";
import { IReduxState } from "store/slices/state.interface";
import { useCallback, useState } from "react";
import { approveNFT, loadNftAllowance } from "store/slices/NFt-slice";
import { ClaimFight } from "store/slices/play-slice";
import { useWeb3React } from "@web3-react/core";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export function BigRoomModal() {
  const dispatch = useDispatch<AppDispatch>();
  const { account } = useWeb3React();
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

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
  const whichroom: number = useSelector<IReduxState, number>(
    (state) => state.battle.whichroom
  );
  const gamePrice: string = useSelector<IReduxState, string>(
    (state) => state.jackpot.gameprice
  );
  const claimState: boolean = useSelector<IReduxState, boolean>(
    (state) => state.battle.claimState
  );
  const waitingNft: string = useSelector<IReduxState, string>(
    (state) => state.battle.waitingNft
  );
  const whichfight: number = useSelector<IReduxState, number>(
    (state) => state.battle.whichfight
  );
  const waitingRandom: number = useSelector<IReduxState, number>(
    (state) => state.battle.waitingRandom
  );
  const nftInfo: string[] = useSelector<IReduxState, string[]>(
    (state) => state.wallet.nftInfo
  );
  const baseUri: string[] = useSelector<IReduxState, string[]>(
    (state) => state.nfts.nfturl
  );
  const approvedList: any[] = useSelector<IReduxState, any[]>(
    (state) => state.nfts.approvedList
  );

  const closeModal = useCallback(async () => {
    dispatch(
      loadBattleDetails({
        openState: false,
        claimState: false,
        whichroom: 0,
        whichfight: 0,
        waitingRandom: 0,
        waitingNft: '',
        decide: false,
      })
    );
  }, []);

  const onClaimFight = useCallback(
    async (index: number, id: number) => {
      await dispatch(
        ClaimFight({
          tokenId: id,
          fightRoom: whichfight,
          whichroom: whichroom,
          url: `https://ipfs.io/ipfs/${baseUri[index]?.slice(7, 53)}/${id}.png`,
          waitingRandom: waitingRandom,
          address: account,
          gamePrice: Number(gamePrice),
          nftAddress: approvedList[index].address,
        })
      );
    },
    [gamePrice, baseUri, account, whichroom, whichfight, waitingRandom]
  );

  const getAllowanceFlag = async(id: number) => {
    await dispatch(loadNftAllowance({
      tokenIds: nftids[id],
      index: id
    }));
  }

  const handleApproveNFT = useCallback(
    async (id: Number, index: number, address: string) => {
      await dispatch(
        approveNFT({
          tokenId: id,
          address: address,
        })
      );
      getAllowanceFlag(index);
    },
    [nftids]
  );

  return (
    <Modal
      open={claimState}
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
                if(approve.address !== waitingNft) return null;
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
                    onClick={() => {getAllowanceFlag(index)}}
                  />
                );
              })}
            </Tabs>
          </TabList>
          {approvedList?.map((approve, index) => {
            if(approve.address !== waitingNft) return null;
            return (
              <TabPanel value={`${index + 1}`} key={index} >
                <Box sx={avatarsStyle}>
                  {nftInfo &&
                    nftInfo.map((info: string, index0) => {
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
                              )}/${info.split('@')[1]}.png`}
                              alt="NFT_avatar"
                              sx={modalAvatarStyle}
                            />
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              onClaimFight(index, Number(info.split('@')[1]));
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
                    nftids[index].map((id: number, index1: number) => {
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
                                allowFlg[index1]
                                  ? () => {
                                      onClaimFight(index, id);
                                      closeModal();
                                    }
                                  : () => handleApproveNFT(id, index, approve.address)
                              }
                            >
                              {allowFlg[index1] ? "Fight" : "Approve"}
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
