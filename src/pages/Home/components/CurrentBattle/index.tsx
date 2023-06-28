import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { AppDispatch } from "state";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "store/slices/state.interface";
import { SampleModal } from "components/Current/modal";
import { BigRoomModal } from "components/Current/bigRoomModal";
import { SmallRooms } from "components/Current/SmallRoom";
import { BigRoom } from "components/Current/BigRoom";
import { loadBattleDetails } from "store/slices/battle-slice";
import instance from "constants/axios";
import io from "socket.io-client";
import { baseURL } from "constants/axios";
import { updateGameData } from "store/slices/game-slice";
import { updateRandomData } from "store/slices/random-slice";
import { updateResultData } from "store/slices/result-slice";
import { gameDataStyle } from "@types";
import { updateWinnerData } from "store/slices/winner-slice";

const CurrentBattle = () => {
  const secRandomData: number[] = useSelector<IReduxState, number[]>(
    (state) => state.fight.random2
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (secRandomData) {
      dispatch(
        loadBattleDetails({
          decide: true,
          openState: false,
          claimState: false,
          whichroom: 0,
          whichfight: 0,
          waitingNft: '',
          waitingRandom: 0,
        })
      );
      setTimeout(async () => {
        instance.delete(`/api/betting/delete/${secRandomData.length - 1}`);

        await dispatch(
          loadBattleDetails({
            decide: false,
            openState: false,
            claimState: false,
            whichroom: 0,
            whichfight: 0,
            waitingNft: '',
            waitingRandom: 0,
          })
        );
      }, 4000);
    }
  }, [secRandomData]);

  var socket = io(baseURL);

  useEffect(() => {
    socket.on("savedRoom", (data: gameDataStyle) => {
      dispatch(updateGameData(data));
    });
  }, []);

  useEffect(() => {
    socket.on("savedRandom", (data: gameDataStyle) => {
      dispatch(updateRandomData(data));
    });
  }, []);

  useEffect(() => {
    socket.on("savedResult", (data: gameDataStyle) => {
      dispatch(updateResultData(data));
    });
  }, []);

  useEffect(() => {
    socket.on("savedWinner", (data: gameDataStyle) => {
      dispatch(updateWinnerData(data));
    });
  }, []);
  

  return (
    <Box
      sx={{
        backgroundColor: "rgba(230,239,237, 0.1)",
        paddingX: "6px",
        mt: { xs: 2, sm: 4, md: 6, xl: 8 },
        pb: { xs: 2, sm: 4, md: 6, xl: 8 },
      }}
    >
      <Box
        display='flex'
        justifyContent='space-between'
      >
        <Box>
          <Typography
            fontFamily="Audiowide"
            sx={{
              fontSize: { xs: "18px", sm: "24px", md: "30px" },
              color: "white",
              textAlign: "center",
              py: { xs: 1, sm: 2, md: 3, xl: 4 },
            }}
          >
            50 TRX Battle (1 Roll & 1 Meow)
          </Typography>
          <SmallRooms />
        </Box>
        <Box>
          <Typography
            fontFamily="Audiowide"
            sx={{
              fontSize: { xs: "18px", sm: "24px", md: "30px" },
              color: "white",
              textAlign: "center",
              py: { xs: 1, sm: 2, md: 3, xl: 4 },
            }}
          >
            250 TRX Battle (5 Rolls & 5 Meow)
          </Typography>
          <BigRoom />
        </Box>
      </Box>

      <SampleModal />
      <BigRoomModal />
    </Box>
  );
};

export default CurrentBattle;
