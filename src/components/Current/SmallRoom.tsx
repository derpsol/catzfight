import { Box, Button } from "@mui/material";
import { roomStyle, buttonStyle } from "components/Current/style";

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
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {data.firstNFt !== "" ? (
                  <Box component="img" src={data.firstNFt} sx={roomStyle} />
                ) : (
                  <Box sx={roomStyle} />
                )}
                <Button
                  sx={buttonStyle}
                  onClick={() => {
                    setWhichroom(index);
                    getGameData();
                    getApprove();
                    setOpenState(true);
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
                      data.secondaddress === null ||
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
                  <Box component="img" src={data.secondNFt} sx={roomStyle} />
                ) : (
                  <Box sx={roomStyle} />
                )}
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
                  sx={buttonStyle}
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
                </Button>
              </Box>
            </Box>
          );
        })}
    </Box>
  );
}
