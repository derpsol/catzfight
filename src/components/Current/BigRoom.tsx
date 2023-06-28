import { useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import roomPic from "assets/images/Ui_box3.webp";
import { Timeline } from "react-gsap";
import buttonBack from "assets/images/button.png";
import { IReduxState } from "store/slices/state.interface";
import { useDispatch, useSelector } from "react-redux";
import { loadBattleDetails } from "store/slices/battle-slice";
import { loadNftDetails } from "store/slices/Nftinfo-slice";
import { useWeb3React } from "@web3-react/core";
import { AppDispatch } from "state";
import { Datas } from "./Datas";
import {
  fightStyle,
  randomNumberStyle,
  roomStyleAvatar,
  roomStyleBack,
  buttonStyle,
  randomNumberPosStyle,
  roomContentTop,
  buttonWidthStyle,
} from "./style";
import { loadNftAllowance } from "store/slices/NFt-slice";
import { gameDataStyle } from "@types";

export function BigRoom() {
  const dispatch = useDispatch<AppDispatch>();
  const { account } = useWeb3React();

  const firRandomData: number[] = useSelector<IReduxState, number[]>(
    (state) => state.fight.random1
  );
  const secRandomData: number[] = useSelector<IReduxState, number[]>(
    (state) => state.fight.random2
  );
  const gameData: gameDataStyle[] = useSelector<IReduxState, gameDataStyle[]>(
    (state) => state.app.gameData
  );
  const decide: boolean = useSelector<IReduxState, boolean>(
    (state) => state.battle.decide
  );
  const nftids: any[] = useSelector<IReduxState, any[]>(
    (state) => state.nfts.nftids
  );

  const onEnterModal = useCallback(async (index: number) => {
    await dispatch(
      loadBattleDetails({
        openState: true,
        whichroom: index + 1,
        claimState: false,
        whichfight: 0,
        waitingRandom: 0,
        waitingNft: '',
        decide: false,
      })
    );
    await dispatch(loadNftDetails({ account: account }));
    // await dispatch(loadNftAllowance({ tokenIds: nftids }));
  }, [account, nftids]);

  const onClaimModal = useCallback(
    async (index: number, fightRoom: number, firstRandom: number, waitingNft: string) => {
      await dispatch(
        loadBattleDetails({
          openState: false,
          whichroom: index + 1,
          claimState: true,
          whichfight: fightRoom,
          waitingRandom: firstRandom,
          waitingNft: waitingNft,
          decide: false,
        })
      );
      await dispatch(loadNftDetails({ account: account }));
      // await dispatch(loadNftAllowance({ tokenIds: nftids }));
    },
    [account, nftids]
  );

  return (
    <Box
      display='flex'
      justifyContent='space-around'
      flexWrap='wrap'
    >
      {Datas &&
        Datas.map((data, index) => {
          if (index < 4) return;
          return (
            <Box
              display="flex"
              justifyContent="flex-start"
              border='1px solid white'
              bgcolor='RGB(0,0,255,0.2)'
              padding={1}
              key={index}
              mt={2}
            >
              <Box
                sx={{
                  mr: { xs: "4px", sm: "6px", md: "8px", xl: "12px" },
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
                  position="absolute"
                  alignItems="center"
                  sx={roomContentTop}
                >
                  {data.firstNFT !== "" ? (
                    <Box
                      component="img"
                      src={data.firstNFT}
                      sx={roomStyleAvatar}
                    />
                  ) : (
                    <Box
                      sx={roomStyleAvatar}
                      alignItems="center"
                      display="flex"
                    >
                      <Timeline
                        target={
                          <Typography sx={fightStyle}>Let's FIGHT</Typography>
                        }
                        repeat={10000}
                      >
                      </Timeline>
                    </Box>
                  )}
                  <Box
                    sx={randomNumberPosStyle}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {data.firstNFT !== "" && data.firstNFT !== undefined ? (
                      <Typography sx={randomNumberStyle}>
                        {/* {random[index * 2]} */}
                      </Typography>
                    ) : (
                      <Typography sx={randomNumberStyle}>
                        Random
                      </Typography>
                    )}
                  </Box>
                  <Button
                    onClick={() => {
                      onEnterModal(index);
                    }}
                    disabled={data.firstNFT !== "" ? true : false}
                    sx={buttonWidthStyle}
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
                  alignItems="center"
                  flexDirection="column"
                  position="absolute"
                  sx={roomContentTop}
                >
                  {data.secondNFT !== "" && data.secondNFT !== undefined ? (
                    <Box
                      component="img"
                      src={data.secondNFT}
                      sx={roomStyleAvatar}
                    />
                  ) : (
                    <Box
                      sx={roomStyleAvatar}
                      display="flex"
                      alignItems="center"
                    >
                      <Timeline
                        target={
                          <Typography sx={fightStyle}>Let's FIGHT</Typography>
                        }
                        repeat={10000}
                      >
                      </Timeline>
                    </Box>
                  )}
                  <Box
                    sx={randomNumberPosStyle}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography sx={randomNumberStyle}>
                      Random
                    </Typography>
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
                      onClaimModal(index, data.fightRoom, data.firstRandom, data.nftAddress);
                    }}
                    sx={buttonWidthStyle}
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
