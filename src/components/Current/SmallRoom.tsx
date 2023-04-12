import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import {
  roomStyleBack,
  roomStyleAvatar,
  buttonStyle,
} from "components/Current/style";
import roomPic from "../../assets/images/Ui_box3.webp";
import { Timeline, Tween } from "react-gsap";
import buttonBack from "../../assets/images/button.png";
import { fightStyle, randomNumberStyle } from "./style";

interface ISmallRooms {
  Datas: any[];
  setWhichroom: Function;
  getGameData: Function;
  getApprove: Function;
  setOpenState: Function;
  setWhichfight: Function;
  setWaitingRandom: Function;
  setClaimState: Function;
  firRandomData: number[];
  secRandomData: number[];
  decide: boolean;
}

export function SmallRooms({
  Datas,
  setWhichroom,
  getGameData,
  getApprove,
  setOpenState,
  firRandomData,
  secRandomData,
  decide,
  setWhichfight,
  setWaitingRandom,
  setClaimState,
}: ISmallRooms) {
  const [random, setRandom] = useState([0]);
  const [mouseIn, setMouseIn] = useState(false);

  const handleMouseEnter = () => {
    setMouseIn(true);
  };

  const handleMouseLeave = () => {
    setMouseIn(false);
  };
  setInterval(() => {
    let rand = [];
    rand[0] = Math.floor(Math.random() * 1000);
    rand[1] = Math.floor(Math.random() * 1000);
    rand[2] = Math.floor(Math.random() * 1000);
    rand[3] = Math.floor(Math.random() * 1000);
    setRandom(rand);
  }, 100);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      {Datas &&
        Datas.map((data, index) => {
          if (index > 3) return;
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                mr: { xs: 1, sm: 2 },
                ml: { xs: 1, sm: 2 },
                mb: { xs: 1, sm: 2 },
              }}
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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Box component="img" src={roomPic} sx={roomStyleBack} />
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  position="absolute"
                  top="30px"
                >
                  {data.firstNFt !== "" ? (
                    <Box
                      component="img"
                      src={data.firstNFt}
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
                        {/* <Tween
                          from={{ scaleX: 1.1, scaleY: 1.1 }}
                          to={{ scaleX: 1, scaleY: 1 }}
                          duration={1.5}
                        />
                        <Tween
                          from={{ scaleX: 1, scaleY: 1 }}
                          to={{ scaleX: 1.1, scaleY: 1.1 }}
                          duration={1.5}
                        /> */}
                      </Timeline>
                    </Box>
                  )}
                  <Box
                    sx={{
                      height: { xs: "36px", sm: '50px', md: "72px" },
                    }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {data.firstNft !== "" && data.firstNft !== undefined ? (
                      <Typography sx={randomNumberStyle}>
                        {random[index * 2]}
                      </Typography>
                    ) : (
                      <Typography sx={randomNumberStyle}>
                        Random Number
                      </Typography>
                    )}
                  </Box>
                  <Button
                    onClick={() => {
                      setWhichroom(index);
                      getGameData();
                      getApprove();
                      setOpenState(true);
                    }}
                    disabled={data.firstNFt !== "" ? true : false}
                    sx={{
                      position: "relative",
                      width: "62%",
                    }}
                  >
                    <Box component="img" src={buttonBack} width="100%" />
                    <Typography
                      sx={buttonStyle}
                      color={data.firstNft ? "white" : "yellow"}
                    >
                      {firRandomData &&
                      decide &&
                      !(
                        firRandomData[index + 1] === undefined ||
                        firRandomData[index + 1] === 0
                      )
                        ? firRandomData[index + 1] > secRandomData[index + 1]
                          ? "Winner"
                          : firRandomData[index + 1] == secRandomData[index + 1]
                          ? "Draw"
                          : "Loser"
                        : data.secondaddress === "" ||
                          data.secondaddress === null ||
                          data.secondaddress === undefined
                        ? data.firstaddress === ""
                          ? "Fight"
                          : `${data.firstaddress?.slice(
                              0,
                              4
                            )}...${data.firstaddress?.slice(-4)}`
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
                  {data.secondNFt !== "" && data.secondNft !== undefined ? (
                    <Timeline
                      target={
                        <Box
                          component="img"
                          src={data.secondNFt}
                          sx={roomStyleAvatar}
                        />
                      }
                      repeat={10000}
                    >
                      <Tween
                        from={{ scaleX: 1.1, scaleY: 1.1 }}
                        to={{ scaleX: 1, scaleY: 1 }}
                        duration={1.5}
                      />
                      <Tween
                        from={{ scaleX: 1, scaleY: 1 }}
                        to={{ scaleX: 1.1, scaleY: 1.1 }}
                        duration={1.5}
                      />
                    </Timeline>
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
                        {/* <Tween
                          from={{ scaleX: 1.1, scaleY: 1.1 }}
                          to={{ scaleX: 1, scaleY: 1 }}
                          duration={1.5}
                        />
                        <Tween
                          from={{ scaleX: 1, scaleY: 1 }}
                          to={{ scaleX: 1.1, scaleY: 1.1 }}
                          duration={1.5}
                        /> */}
                      </Timeline>
                    </Box>
                  )}
                  <Box
                    sx={{
                      height: { xs: "36px", sm: '50px', md: "72px" },
                    }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography sx={randomNumberStyle}>
                      Random Number
                    </Typography>
                  </Box>
                  <Button
                    disabled={
                      !(
                        data.firstNFt !== "" ||
                        data.secondaddress !== null ||
                        data.secondaddress === undefined
                      )
                        ? true
                        : false
                    }
                    onClick={() => {
                      setWhichroom(index);
                      setWhichfight(data.fightroom);
                      setWaitingRandom(data.firstrandom);
                      getGameData();
                      getApprove();
                      setClaimState(true);
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
                          : firRandomData[index + 1] == secRandomData[index + 1]
                          ? "Draw"
                          : "Winner"
                        : data.secondaddress === "" ||
                          data.secondaddress === null ||
                          data.secondaddress === undefined
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
