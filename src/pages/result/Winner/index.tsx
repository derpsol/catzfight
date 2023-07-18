import {
  Box,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { useSelector } from "react-redux";
import { IReduxState } from "store/slices/state.interface";
import first from "assets/images/first.png";
import second from "assets/images/second.png";
import third from "assets/images/third.png";
import other from "assets/images/other.png";

const Winner = () => {
  const winnerData: any[] = useSelector<IReduxState, any[]>(
    (state) => state.winner.winnerData
  );

  return (
    <Box
      sx={{
        paddingX: "6px",
        pt: { xs: 2, sm: 4, md: 6, xl: 8 },
        pb: 1,
      }}
      height="100vh"
      width="100%"
    >
      <Typography
        fontFamily="Audiowide"
        sx={{
          fontSize: { xs: "24px", sm: "30px" },
          color: "white",
          textAlign: "center",
          py: { xs: 1, sm: 2, md: 3, xl: 4 },
          mb: { xs: 1, sm: 2, md: 3, xl: 4 },
        }}
      >
        Top 10 Winners
      </Typography>
      <Table>
        <TableBody>
          {winnerData &&
            winnerData.map((data, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    padding: "0",
                    textAlign: "center",
                  }}
                >
                  {data.rank === 1 ? (
                    <Box component="img" src={first} width="50px" />
                  ) : data.rank === 2 ? (
                    <Box component="img" src={second} width="50px" />
                  ) : data.rank === 3 ? (
                    <Box component="img" src={third} width="50px" />
                  ) : (
                    <Box component="img" src={other} width="50px" />
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    padding: "0",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: { xs: "14px", sm: "16px", md: "20px" },
                    }}
                  >
                    {`${data.address.slice(0, 4)}...${data.address.slice(-4)}`}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "none",
                    padding: "0",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: { xs: "14px", sm: "16px", md: "20px" },
                    }}
                  >
                    {data.winCount} wins
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Winner;
