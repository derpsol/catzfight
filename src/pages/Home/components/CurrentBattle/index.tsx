import { Box, Typography } from "@mui/material";
import { ClaimFight, EnterRoom } from "store/slices/play-slice";
import { approveNFT, loadNftAllowance } from "store/slices/NFt-slice";
import { loadNftDetails } from "store/slices/Nftinfo-slice";
import { loadGameDetails } from "store/slices/game-slice";
import { useEffect, useState } from "react";
import { AppDispatch } from "state";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { IReduxState } from "../../../../store/slices/state.interface";
import io from "socket.io-client";
import { useWeb3React } from "@web3-react/core";
import { walletInfo } from "store/slices/walletInfo-slice";
import { getDate } from "components/Current/getDate";
import { Datas } from "components/Current/Datas";
import { BigRoomModal, SampleModal } from "components/Current/modal";
import { SmallRooms } from "components/Current/SmallRoom";
import { BigRoom } from "components/Current/BigRoom";

const CurrentBattle = () => {
  const { account } = useWeb3React();

  const gameData: any[] = useSelector<IReduxState, any[]>(
    (state) => state.app.gameData
  );
  const gamePrice: string = useSelector<IReduxState, string>(
    (state) => state.app.gameprice
  );
  let firRandomData: number[] = useSelector<IReduxState, number[]>(
    (state) => state.fight.random1
  );
  let secRandomData: number[] = useSelector<IReduxState, number[]>(
    (state) => state.fight.random2
  );
  const allowFlg: boolean[] = useSelector<IReduxState, boolean[]>(
    (state) => state.nft.allowances
  );
  const isLoading: boolean = useSelector<IReduxState, boolean>(
    (state) => state.nft.loading
  );
  const nftids: any[] = useSelector<IReduxState, any[]>(
    (state) => state.nfts.nftids
  );
  const nfturis: any[] = useSelector<IReduxState, any[]>(
    (state) => state.nfts.nfturis
  );

  gameData &&
    gameData.map((data) => {
      Datas[data.roomnum - 1].firstNFt = data.firstNFT;
      Datas[data.roomnum - 1].secondNFt = data.secondNFT;
      Datas[data.roomnum - 1].firstaddress = data.firstaddress;
      Datas[data.roomnum - 1].secondaddress = data.secondaddress;
      Datas[data.roomnum - 1].firstrandom = data.firstRandom;
      Datas[data.roomnum - 1].secondrandom = data.secondRandom;
      Datas[data.roomnum - 1].fightroom = data.fightRoom;
      Datas[data.roomnum - 1].whichfight = data.whichFight;
      Datas[data.roomnum - 1].tokenId = data.tokenId;
    });

  const [openState, setOpenState] = useState(false);
  const [claimState, setClaimState] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [whichroom, setWhichroom] = useState(0);
  const [whichfight, setWhichfight] = useState(0);
  const [waitingRandom, setWaitingRandom] = useState(0);
  const [decide, setDecide] = useState(false);
  const [address, setAddress] = useState("");

  var socket = io("http://13.57.204.10");

  function getGameData() {
    dispatch(loadGameDetails({ account: address }));
  }

  function getAvailableData() {
    dispatch(walletInfo({ account: address }));
  }

  function getNftData() {
    dispatch(loadNftDetails({ account: address }));
  }

  function getApprove() {
    dispatch(loadNftAllowance({ tokenIds: nftids }));
  }

  async function approve(id: Number) {
    let approveTmp = await dispatch(
      approveNFT({
        tokenId: id,
      })
    );
    if (approveTmp.meta.requestStatus === "fulfilled") {
      getApprove();
    }
  }

  async function onEnterRoom(index: number) {
    let fightRoomnum = getDate();
    let enterState = await dispatch(
      EnterRoom({
        tokenId: nftids[index],
        fightRoom: fightRoomnum,
        whichroom: whichroom + 1,
        url: nfturis[index],
        address: address,
        gamePrice: Number(gamePrice),
      })
    );
    if (enterState.meta.requestStatus === "fulfilled") {
      reload();
    }
  }

  async function onClaimFight(index: number) {
    let claimStatus = await dispatch(
      ClaimFight({
        tokenId: nftids[index],
        fightRoom: whichfight,
        whichroom: whichroom + 1,
        url: nfturis[index],
        waitingRandom: waitingRandom,
        address: address,
        gamePrice: Number(gamePrice),
      })
    );
    if (claimStatus.meta.requestStatus === "fulfilled") {
      reload();
    }
  }

  useEffect(() => {
    if (isLoading) {
      getApprove();
    }
  }, [isLoading]);

  function reload() {
    socket.emit("enter");
  }

  useEffect(() => {
    if (account && account !== "") {
      setAddress(account);
    }
  }, [account]);

  useEffect(() => {
    socket.on("entered", () => {
      getGameData();
      getNftData();
      getApprove();
      getAvailableData();
    });
  }, [address]);

  useEffect(() => {
    if (secRandomData) {
      setDecide(true);
      setTimeout(() => {
        axios.delete(
          `http://13.57.204.10/api/betting/delete/${secRandomData.length - 1}`
        );
        setDecide(false);
        reload();
      }, 4000);
    }
  }, [secRandomData]);

  return (
    <Box
      sx={{
        backgroundColor: "rgba(230,239,237, 0.1)",
        paddingX: "6px",
        mt: { xs: 2, sm: 4, md: 6, xl: 8 },
        pb: { xs: 2, sm: 4, md: 6, xl: 8 },
      }}
    >
      <Typography
        fontFamily="Audiowide"
        sx={{
          fontSize: { xs: "24px", sm: "30px" },
          color: "white",
          textAlign: "center",
          py: { xs: 1, sm: 2, md: 3, xl: 4 },
        }}
      >
        50 TRX Battle (1 Roll & 1 Meow)
      </Typography>
      <SmallRooms
        Datas={Datas}
        setWhichroom={setWhichroom}
        getGameData={getGameData}
        getApprove={getApprove}
        setOpenState={setOpenState}
        setWhichfight={setWhichfight}
        setWaitingRandom={setWaitingRandom}
        setClaimState={setClaimState}
        firRandomData={firRandomData}
        secRandomData={secRandomData}
        decide={decide}
      />
      <Typography
        fontFamily="Audiowide"
        sx={{
          fontSize: { xs: "24px", sm: "30px" },
          color: "white",
          textAlign: "center",
          py: { xs: 2, sm: 3, md: 4, xl: 5 },
        }}
      >
        250 TRX Battle (5 Rolls & 5 Meow)
      </Typography>
      <BigRoom
        Datas={Datas}
        setWhichroom={setWhichroom}
        getGameData={getGameData}
        getApprove={getApprove}
        setOpenState={setOpenState}
        setWhichfight={setWhichfight}
        setWaitingRandom={setWaitingRandom}
        setClaimState={setClaimState}
        firRandomData={firRandomData}
        secRandomData={secRandomData}
        decide={decide}
      />

      <SampleModal
        openState={openState}
        setOpenState={setOpenState}
        nftids={nftids}
        nfturis={nfturis}
        isLoading={isLoading}
        allowFlg={allowFlg}
        onEnterRoom={onEnterRoom}
        approve={approve}
      />
      <BigRoomModal
        claimState={claimState}
        setClaimState={setClaimState}
        setWhichfight={setWhichfight}
        nftids={nftids}
        nfturis={nfturis}
        isLoading={isLoading}
        allowFlg={allowFlg}
        onClaimFight={onClaimFight}
        approve={approve}
      />
    </Box>
  );
};

export default CurrentBattle;
