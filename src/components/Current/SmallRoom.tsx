import { useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import roomPic from "assets/images/Ui_box3.webp";
import buttonBack from "assets/images/button.png";
import { IReduxState } from "store/slices/state.interface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "state";
import { Datas } from "./Datas";
import { loadBattleDetails } from "store/slices/battle-slice";
import { loadNftDetails } from "store/slices/Nftinfo-slice";
import { useWeb3React } from "@web3-react/core";
import {
  fightStyle,
  randomNumberStyle,
  roomStyleAvatar,
  roomStyleBack,
  buttonStyle,
} from "./style";
import { loadNftAllowance } from "store/slices/NFt-slice";
import { gameDataStyle } from "@types";

export function SmallRooms() {
  const { account } = useWeb3React();
  const dispatch = useDispatch<AppDispatch>();
  const firRandomData: number[] = useSelector<IReduxState, number[]>(
    (state) => state.fight.random1
  );
  const secRandomData: number[] = useSelector<IReduxState, number[]>(
    (state) => state.fight.random2
  );
  const gameData: gameDataStyle[] = useSelector<IReduxState, any[]>(
    (state) => state.app.gameData
  );
  const decide: boolean = useSelector<IReduxState, boolean>(
    (state) => state.battle.decide
  );
  const nftids: any[] = useSelector<IReduxState, any[]>(
    (state) => state.nfts.nftids
  );

  const onEnterModal = useCallback(
    async (index: number) => {
      await dispatch(loadNftDetails({ account: account }));
      await dispatch(loadNftAllowance({ tokenIds: nftids }));
      await dispatch(
        loadBattleDetails({
          openState: true,
          whichroom: index + 1,
          claimState: false,
          whichfight: 0,
          waitingRandom: 0,
          decide: false,
        })
      );
    },
    [account, nftids]
  );

  const onClaimModal = useCallback(
    async (index: number, fightRoom: number, firstRandom: number) => {
      await dispatch(loadNftDetails({ account: account }));
      await dispatch(loadNftAllowance({ tokenIds: nftids }));
      await dispatch(
        loadBattleDetails({
          openState: false,
          whichroom: index + 1,
          claimState: true,
          whichfight: fightRoom,
          waitingRandom: firstRandom,
          decide: false,
        })
      );
    },
    [account, nftids]
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      {(gameData ? gameData : Datas)?.map((data, index) => {
        return (
          <Box
            display="flex"
            justifyContent="flex-start"
            sx={{
              mr: { xs: 1, sm: 2 },
              ml: { xs: 1, sm: 2 },
              mb: { xs: 1, sm: 2 },
            }}
            border="1px solid white"
            bgcolor="RGB(255,255,255,0.1)"
            padding={2}
            key={index}
          >
            <Box
              sx={{
                mr: { xs: "6px", sm: "8px", md: "12px", xl: "16px" },
              }}
              position="relative"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box component="img" src={roomPic} sx={roomStyleBack} />
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                position="absolute"
                top="30px"
              >
                {data.firstNFT !== "" ? (
                  <Box
                    component="img"
                    src={data.firstNFT}
                    sx={roomStyleAvatar}
                  />
                ) : (
                  <Box sx={roomStyleAvatar} alignItems="center" display="flex">
                    <Typography sx={fightStyle}>Let's FIGHT</Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    height: { xs: "36px", sm: "50px", md: "72px" },
                  }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {data.firstNFT !== "" && data.firstNFT !== undefined ? (
                    <Typography sx={randomNumberStyle}>
                      {data.firstRandom}
                    </Typography>
                  ) : (
                    <Typography sx={randomNumberStyle}>
                      Random Number
                    </Typography>
                  )}
                </Box>
                <Button
                  onClick={() => {
                    onEnterModal(index);
                  }}
                  disabled={data.firstNFT !== "" ? true : false}
                  sx={{
                    position: "relative",
                    width: "62%",
                  }}
                >
                  <Box component="img" src={buttonBack} width="100%" />
                  <Typography
                    sx={buttonStyle}
                    color={data.firstNFT ? "white" : "yellow"}
                  >
                    {firRandomData &&
                    decide &&
                    !(
                      firRandomData[index + 1] === undefined ||
                      firRandomData[index + 1] === 0
                    )
                      ? firRandomData[index + 1] > secRandomData[index + 1]
                        ? "Winner"
                        : firRandomData[index + 1] === secRandomData[index + 1]
                        ? "Draw"
                        : "Loser"
                      : data.secondAddress === "" ||
                        data.secondAddress === null ||
                        data.secondAddress === undefined
                      ? data.firstAddress === ""
                        ? "Fight"
                        : `${data.firstAddress?.slice(
                            0,
                            4
                          )}...${data.firstAddress?.slice(-4)}`
                      : "Fighting..."}
                  </Typography>
                </Button>
              </Box>
            </Box>
            <Box
              position="relative"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box component="img" src={roomPic} sx={roomStyleBack} />
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                position="absolute"
                top="30px"
              >
                {data.secondNFT !== "" && data.secondNFT !== undefined ? (
                  <Box
                    component="img"
                    src={data.secondNFT}
                    sx={roomStyleAvatar}
                  />
                ) : (
                  <Box sx={roomStyleAvatar} display="flex" alignItems="center">
                    <Typography sx={fightStyle}>Let's FIGHT</Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    height: { xs: "36px", sm: "50px", md: "72px" },
                  }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {data.secondNFT !== "" && data.secondNFT !== undefined ? (
                    <Typography sx={randomNumberStyle}>
                      {data.secondRandom}
                    </Typography>
                  ) : (
                    <Typography sx={randomNumberStyle}>
                      Random Number
                    </Typography>
                  )}
                </Box>
                <Button
                  disabled={
                    !(
                      data.firstNFT !== "" ||
                      data.secondAddress !== null ||
                      data.secondAddress === undefined
                    )
                      ? true
                      : false
                  }
                  onClick={() => {
                    onClaimModal(index, data.fightRoom, data.firstRandom);
                  }}
                  sx={{
                    position: "relative",
                    width: "62%",
                  }}
                >
                  <Box component="img" src={buttonBack} width="100%" />
                  <Typography
                    sx={buttonStyle}
                    color={
                      secRandomData && secRandomData[index + 1]
                        ? "white"
                        : "yellow"
                    }
                  >
                    {secRandomData &&
                    decide &&
                    !(
                      secRandomData[index + 1] === undefined ||
                      secRandomData[index + 1] === 0
                    )
                      ? firRandomData[index + 1] > secRandomData[index + 1]
                        ? "Loser"
                        : firRandomData[index + 1] === secRandomData[index + 1]
                        ? "Draw"
                        : "Winner"
                      : data.secondAddress === "" ||
                        data.secondAddress === null ||
                        data.secondAddress === undefined
                      ? "Fight"
                      : "Fighting..."}
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
