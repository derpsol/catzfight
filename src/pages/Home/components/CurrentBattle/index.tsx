import { Box, Typography } from "@mui/material";
import { loadNftAllowance } from "store/slices/NFt-slice";
import { loadNftDetails } from "store/slices/Nftinfo-slice";
import { loadGameDetails } from "store/slices/game-slice";
import { useCallback, useEffect, useState } from "react";
import { AppDispatch } from "state";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { IReduxState } from "../../../../store/slices/state.interface";
import io from "socket.io-client";
import { useWeb3React } from "@web3-react/core";
import { walletInfo } from "store/slices/walletInfo-slice";
import { SampleModal } from "components/Current/modal";
import { BigRoomModal } from "components/Current/bigRoomModal";
import { SmallRooms } from "components/Current/SmallRoom";
import { BigRoom } from "components/Current/BigRoom";
import { loadBattleDetails } from "store/slices/battle-slice";

const CurrentBattle = () => {
  const { account } = useWeb3React();

  const secRandomData: number[] = useSelector<IReduxState, number[]>(
    (state) => state.fight.random2
  );
  const nftids: any[] = useSelector<IReduxState, any[]>(
    (state) => state.nfts.nftids
  );

  const dispatch = useDispatch<AppDispatch>();
  const [address, setAddress] = useState("");

  var socket = io("http://localhost:8001");

  const getWholeData = useCallback(async () => {
    await dispatch(loadGameDetails({ account: address }));
    await dispatch(walletInfo({ account: address }));
    await dispatch(loadNftDetails({ account: address }));
    await dispatch(loadNftAllowance({ tokenIds: nftids }));
  }, []);

  useEffect(() => {
    if (account && account !== "") {
      setAddress(account);
    }
  }, [account]);

  useEffect(() => {
    socket.on("entered", () => {
      getWholeData();
    });
  }, [address]);

  useEffect(() => {
    if (secRandomData) {
      dispatch(
        loadBattleDetails({
          decide: true,
          openState: false,
          claimState: false,
          whichroom: 0,
          whichfight: 0,
          waitingRandom: 0,
        })
      );
      setTimeout(() => {
        axios.delete(
          `http://localhost:8001/api/betting/delete/${secRandomData.length - 1}`
        );
        dispatch(
          loadBattleDetails({
            decide: false,
            openState: false,
            claimState: false,
            whichroom: 0,
            whichfight: 0,
            waitingRandom: 0,
          })
        );
        socket.emit("enter");
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
      <SmallRooms />
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
      <BigRoom />

      <SampleModal />
      <BigRoomModal />
    </Box>
  );
};

export default CurrentBattle;
