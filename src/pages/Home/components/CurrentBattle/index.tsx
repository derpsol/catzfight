import { Box, Typography, Button, Skeleton } from "@mui/material";
import { ClaimFight, EnterRoom } from "store/slices/play-slice";
import { approveNFT, loadNFTDetails } from "store/slices/NFt-slice";
import { loadGameDetails } from "store/slices/game-slice";
import { useEffect, useState } from "react";
import { AppDispatch } from "state";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { IReduxState } from "../../../../store/slices/state.interface";
import io from "socket.io-client";
import { useWeb3React } from "@web3-react/core";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "400px", sm: "500px", md: "700px", lg: "1000px" },
  height: "600px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  justifyContent: "space-around",
  flexWrap: "wrap",
  backgroundColor: "rgba(38,40,42)",
  borderRadius: 8,
  overflowY: "scroll",
};

const CurrentBattle = () => {
  const { account } = useWeb3React();

  const gameData: any[] = useSelector<IReduxState, any[]>(
    (state) => state.app.gameData
  );
  let firRandomData: number[] = useSelector<IReduxState, number[]>(
    (state) => state.fight.random1
  );
  let secRandomData: number[] = useSelector<IReduxState, number[]>(
    (state) => state.fight.random2
  );
  const gameLoading: boolean = useSelector<IReduxState, boolean>(
    (state) => state.app.loading
  );
  const allowFlg: boolean[] = useSelector<IReduxState, boolean[]>(
    (state) => state.nft.allowances
  );
  const isLoading: boolean = useSelector<IReduxState, boolean>(
    (state) => state.nft.loading
  );
  const nftids: any[] = useSelector<IReduxState, any[]>(
    (state) => state.app.nftids
  );
  const nfturis: any[] = useSelector<IReduxState, any[]>(
    (state) => state.app.nfturis
  );

  const Datas = [
    {
      roomnum: 1,
      firstNFt: "",
      secondNFt: "",
      firstaddress: "",
      secondaddress: "",
      fightroom: 0,
      whichfight: 0,
    },
    {
      roomnum: 2,
      firstNFt: "",
      secondNFt: "",
      firstaddress: "",
      secondaddress: "",
      fightroom: 0,
      whichfight: 0,
    },
    {
      roomnum: 3,
      firstNFt: "",
      secondNFt: "",
      firstaddress: "",
      secondaddress: "",
      whichfight: 0,
      fightroom: 0,
    },
    {
      roomnum: 4,
      firstNFt: "",
      secondNFt: "",
      firstaddress: "",
      secondaddress: "",
      fightroom: 0,
      whichfight: 0,
    },
    {
      roomnum: 5,
      firstNFt: "",
      secondNFt: "",
      firstaddress: "",
      secondaddress: "",
      fightroom: 0,
      whichfight: 0,
    },
    {
      roomnum: 6,
      firstNFt: "",
      secondNFt: "",
      firstaddress: "",
      secondaddress: "",
      fightroom: 0,
      whichfight: 0,
    },
    {
      roomnum: 7,
      firstNFt: "",
      secondNFt: "",
      firstaddress: "",
      secondaddress: "",
      fightroom: 0,
      whichfight: 0,
    },
    {
      roomnum: 8,
      firstNFt: "",
      secondNFt: "",
      firstaddress: "",
      secondaddress: "",
      fightroom: 0,
      whichfight: 0,
    },
  ];

  gameData &&
    gameData.map((data) => {
      Datas[data.roomnum - 1].firstNFt = data.firstNFT;
      Datas[data.roomnum - 1].secondNFt = data.secondNFT;
      Datas[data.roomnum - 1].firstaddress = data.firstaddress;
      Datas[data.roomnum - 1].secondaddress = data.secondaddress;
      Datas[data.roomnum - 1].fightroom = data.fightRoom;
      Datas[data.roomnum - 1].whichfight = data.whichFight;
    });

  const [openState, setOpenState] = useState(false);
  const [claimState, setClaimState] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [whichroom, setWhichroom] = useState(0);
  const [whichfight, setWhichfight] = useState(0);
  const [decide, setDecide] = useState(false);
  var socket = io("http://173.249.54.208");

  const getDate = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let number =
      year * Math.pow(10, 10) +
      month * Math.pow(10, 8) +
      day * Math.pow(10, 6) +
      hour * Math.pow(10, 4) +
      minute * Math.pow(10, 2) +
      second;
    return number;
  };

  async function getGameData() {
    await dispatch(loadGameDetails({account}));
  }

  async function getApprove() {
    await dispatch(
      loadNFTDetails({
        tokenIds: nftids,
      })
    );
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
        address: account,
      })
    );
    if (enterState.meta.requestStatus === "fulfilled") {
      reload();
    }
  }

  async function onClaimFight(index: number) {
    let fightState = await dispatch(
      ClaimFight({
        tokenId: nftids[index],
        fightRoom: whichfight,
        whichroom: whichroom + 1,
        url: nfturis[index],
        address: account,
      })
    );
    if (fightState.meta.requestStatus === "fulfilled") {
      reload();
    }
  }

  useEffect(() => {
    if (isLoading) {
      getApprove();
    }
  }, [isLoading]);

  useEffect(() => {
    if (gameLoading) {
      reload();
    }
  }, [gameLoading]);

  function reload() {
    socket.emit("enter");
  }

  useEffect(() => {
    socket.on("entered", () => {
      getGameData();
      getApprove();
    });
  }, []);

  useEffect(() => {
    if (secRandomData) {
      setDecide(true);
      setTimeout(() => {
        axios.delete(
          `http://173.249.54.208/api/betting/delete/${secRandomData.length - 1}`
        );
        setDecide(false);
        reload();
      }, 4000);
    }
  }, [secRandomData]);

  let isFightable = false;
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
        10 TRX Battle (1 Roll & 1 Meow)
      </Typography>
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
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {data.firstNFt !== "" ? (
                    <Box
                      component="img"
                      src={data.firstNFt}
                      sx={{
                        width: { xs: "120px", sm: "160px", md: "200px" },
                        height: { xs: "120px", sm: "160px", md: "200px" },
                        border: "4px solid #F39B33",
                        borderRadius: { xs: "10px", sm: "15px", md: "20px" },
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: { xs: "120px", sm: "160px", md: "200px" },
                        height: { xs: "120px", sm: "160px", md: "200px" },
                        border: "4px solid #F39B33",
                        borderRadius: { xs: "10px", sm: "15px", md: "20px" },
                      }}
                    />
                  )}
                  <Button
                    sx={{
                      fontSize: { xs: "15px", sm: "18px" },
                      border: "2px solid white",
                      width: { xs: "120px", sm: "160px", md: "200px" },
                      backgroundColor: "rgba(38,40,42,0.64)",
                      paddingX: "0",
                      textAlign: "center",
                      minWidth: "60px",
                      paddingY: { xs: "2px", sm: "4px" },
                      mt: { xs: 1, sm: 2 },
                      color: isFightable ? "green" : "#FF1E1E",
                    }}
                    onClick={() => {
                      setOpenState(true);
                      setWhichroom(index);
                      getGameData();
                    }}
                    disabled={data.firstNFt !== "" ? true : false}
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
                        data.secondaddress === undefined
                      ? data.firstaddress === ""
                        ? "Fight"
                        : `${data.firstaddress?.slice(
                            0,
                            4
                          )}...${data.firstaddress?.slice(-4)}`
                      : "Fighting..."}
                  </Button>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  {data.secondNFt !== "" ? (
                    <Box
                      component="img"
                      src={data.secondNFt}
                      sx={{
                        width: { xs: "120px", sm: "160px", md: "200px" },
                        height: { xs: "120px", sm: "160px", md: "200px" },
                        border: "4px solid #F39B33",
                        borderRadius: { xs: "10px", sm: "15px", md: "20px" },
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: { xs: "120px", sm: "160px", md: "200px" },
                        height: { xs: "120px", sm: "160px", md: "200px" },
                        border: "4px solid #F39B33",
                        borderRadius: { xs: "10px", sm: "15px", md: "20px" },
                      }}
                    />
                  )}
                  <Button
                    disabled={
                      data.secondNFt !== "" && data.secondaddress !== undefined
                        ? true
                        : false
                    }
                    onClick={() => {
                      setClaimState(true);
                      setWhichroom(index);
                      setWhichfight(data.fightroom);
                      getGameData();
                    }}
                    sx={{
                      fontSize: { xs: "15px", sm: "18px" },
                      border: "2px solid white",
                      width: { xs: "120px", sm: "160px", md: "200px" },
                      backgroundColor: "rgba(38,40,42,0.64)",
                      paddingX: "0",
                      textAlign: "center",
                      minWidth: "60px",
                      paddingY: { xs: "2px", sm: "4px" },
                      my: { xs: 1, sm: 2 },
                      "& .css-2pgj13-MuiButtonBase-root-MuiButton-root.Mui-disabled":
                        { color: "#FF1E1E" },
                    }}
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
                        data.secondaddress === undefined
                      ? "Fight"
                      : "Fighting..."}
                  </Button>
                </Box>
              </Box>
            );
          })}
      </Box>
      <Typography
        fontFamily="Audiowide"
        sx={{
          fontSize: { xs: "24px", sm: "30px" },
          color: "white",
          textAlign: "center",
          py: { xs: 2, sm: 3, md: 4, xl: 5 },
        }}
      >
        100 TRX Battle (10 Rolls & 10 Meow)
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        {Datas &&
          Datas.map((data, index) => {
            if (index < 4) return;
            return (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  mr: { xs: 2, sm: 3 },
                  mb: { xs: 1, sm: 2 },
                }}
                key={index}
              >
                <Box
                  sx={{
                    marginRight: {
                      xs: "6px",
                      sm: "8px",
                      md: "12px",
                      xl: "16px",
                    },
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: "120px", sm: "160px", md: "200px" },
                      height: { xs: "120px", sm: "160px", md: "200px" },
                      border: "4px solid #F39B33",
                      borderRadius: { xs: "10px", sm: "15px", md: "20px" },
                    }}
                  />
                  <Button
                    sx={{
                      fontSize: { xs: "15px", sm: "18px" },
                      border: "2px solid white",
                      width: { xs: "120px", sm: "160px", md: "200px" },
                      backgroundColor: "rgba(38,40,42,0.64)",
                      paddingX: "0",
                      textAlign: "center",
                      minWidth: "60px",
                      paddingY: { xs: "2px", sm: "4px" },
                      mt: { xs: 1, sm: 2 },
                      color: isFightable ? "green" : "#FF1E1E",
                    }}
                    onClick={() => {
                      setOpenState(true);
                      setWhichroom(index);
                      getGameData();
                    }}
                    disabled={data.firstNFt !== "" ? true : false}
                  >
                    {data.secondaddress === "" ||
                    data.secondaddress === undefined
                      ? data.firstaddress === ""
                        ? "Fight"
                        : `${data.firstaddress?.slice(
                            0,
                            4
                          )}...${data.firstaddress?.slice(-4)}`
                      : "Fighting..."}
                  </Button>
                </Box>
                <Box>
                  <Box
                    sx={{
                      width: { xs: "120px", sm: "160px", md: "200px" },
                      height: { xs: "120px", sm: "160px", md: "200px" },
                      border: "4px solid #F39B33",
                      borderRadius: { xs: "10px", sm: "15px", md: "20px" },
                    }}
                  />
                  <Button
                    sx={{
                      fontSize: { xs: "15px", sm: "18px" },
                      border: "2px solid white",
                      width: { xs: "120px", sm: "160px", md: "200px" },
                      backgroundColor: "rgba(38,40,42,0.64)",
                      paddingX: "0",
                      textAlign: "center",
                      minWidth: "60px",
                      paddingY: { xs: "2px", sm: "4px" },
                      mt: { xs: 1, sm: 2 },
                      color: isFightable ? "green" : "#FF1E1E",
                    }}
                    onClick={() => {
                      setClaimState(true);
                      setWhichroom(index);
                      setWhichfight(data.fightroom);
                      getGameData();
                    }}
                    disabled={
                      data.firstNFt !== "" && data.secondaddress !== undefined
                        ? true
                        : false
                    }
                  >
                    {data.secondaddress === "" ||
                    data.secondaddress === undefined
                      ? "Fight"
                      : "Fighting..."}
                  </Button>
                </Box>
              </Box>
            );
          })}
      </Box>
      <Modal
        open={openState}
        onClose={() => {
          setOpenState(false);
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
                        sx={{
                          width: {
                            sx: "60px",
                            sm: "100px",
                            md: "150px",
                            lg: "230px",
                          },
                          height: "100%",
                          borderRadius: "12px",
                        }}
                      />
                    ) : (
                      <Skeleton
                        sx={{
                          width: {
                            sx: "60px",
                            sm: "100px",
                            md: "150px",
                            lg: "230px",
                          },
                          height: {
                            sx: "60px",
                            sm: "100px",
                            md: "150px",
                            lg: "230px",
                          },
                        }}
                      />
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
                              setOpenState(false);
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
      <Modal
        open={claimState}
        onClose={() => {
          setClaimState(false);
          setWhichfight(0);
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
                        sx={{
                          width: {
                            sx: "60px",
                            sm: "100px",
                            md: "150px",
                            lg: "230px",
                          },
                          height: "100%",
                          borderRadius: "12px",
                        }}
                      />
                    ) : (
                      <Skeleton
                        sx={{
                          width: {
                            sx: "60px",
                            sm: "100px",
                            md: "150px",
                            lg: "230px",
                          },
                          height: {
                            sx: "60px",
                            sm: "100px",
                            md: "150px",
                            lg: "230px",
                          },
                        }}
                      />
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
                              onClaimFight(index);
                              setClaimState(false);
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
    </Box>
  );
};

export default CurrentBattle;
