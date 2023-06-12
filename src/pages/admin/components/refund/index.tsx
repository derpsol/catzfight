import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { IReduxState } from "store/slices/state.interface";
import { useDispatch, useSelector } from "react-redux";
import { gameDataStyle } from "@types";
import { useCallback, useEffect, useState } from "react";
import { AppDispatch } from "state";
import { refundRoom } from "store/slices/refund-slice";
import instance from "constants/axios";

function Refund() {
  const [displayData, setDisplayData] = useState<gameDataStyle[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const gameData: gameDataStyle[] = useSelector<IReduxState, any[]>(
    (state) => state.app.gameData
  );

  let filteredData: gameDataStyle[] = [];

  const handleRefund = useCallback(
    async (id: Number, nftAddress: string, fighterAddress: string, roomNum: number) => {
      await dispatch(
        refundRoom({
          tokenId: id,
          nftAddress: nftAddress,
          fighterAddress: fighterAddress
        })
      );
      instance.delete(`/api/betting/delete/${roomNum}`);
    },
    []
  );

  useEffect(() => {
    let cnt = 0;
    for(let i = 0; i < gameData.length; i ++) {
      if(gameData[i].firstAddress === '') {
        console.log(gameData[i].firstAddress);
        continue;
      }
      filteredData.push(gameData[i]);
      setDisplayData(filteredData);
    }
  }, [gameData]);

  return (
    <Box>
      <Typography
        fontSize="40px"
        fontWeight="700"
        color="white"
        textAlign="center"
        pt="24px"
        pb="24px"
      >
        Refund List
      </Typography>
      <Box>
        <Table sx={{ minWidth: 320 }} aria-label="simple table">
          {displayData.length !== 0 ? (
            <>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      display: { xs: "none", sm: "table-cell" },
                    }}
                    align="center"
                  >
                    <Typography color="white">Category</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="white">Created At</Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      display: { xs: "none", md: "table-cell" },
                    }}
                    align="center"
                  >
                    <Typography color="white">Refund</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayData.map((data, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      sx={{
                        display: { xs: "none", sm: "table-cell" },
                      }}
                      component="th"
                      scope="row"
                      align="center"
                    >
                      <Typography color="white">{data.nftName}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          wordBreak: "break-all",
                        }}
                        color="white"
                      >
                        {data.createdAt}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="warning"
                        sx={{
                          marginTop: { xs: "8px", sm: "0px" },
                          display: { xs: "none", sm: "inline-flex" },
                        }}
                        onClick={() => {
                          handleRefund(data.tokenId, data.nftAddress, data.firstAddress, data.roomNum);
                        }}
                      >
                        Refund
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          ) : (
            <Typography color="white" fontSize="32px" textAlign="center">
              You have no waiting Rooms!
            </Typography>
          )}
        </Table>
      </Box>
    </Box>
  );
}

export default Refund;