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

const Winner = () => {
  const winnerData: any[] = useSelector<IReduxState, any[]>(
    (state) => state.winner.winnerData
  );

  return (
    <Box
      sx={{
        backgroundColor: "rgba(230,239,237, 0.1)",
        paddingX: "6px",
        mt: { xs: 2, sm: 4, md: 6, xl: 8 },
        pb: 1,
      }}
    >
      <Typography
        fontFamily="Audiowide"
        sx={{
          fontSize: { xs: "20px", sm: "25px" },
          color: "#F39B33",
          py: { xs: 1, md: 2 },
        }}
      >
        Top 10 Winners
      </Typography>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              sx={{ borderBottom: "none", padding: "0", textAlign: "center" }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontSize: { xs: "14px", sm: "16px", md: "20px" },
                }}
              >
                Wins:
              </Typography>
            </TableCell>
            <TableCell
              sx={{ borderBottom: "none", padding: "0", textAlign: "center" }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontSize: { xs: "14px", sm: "16px", md: "20px" },
                }}
              >
                Address:
              </Typography>
            </TableCell>
          </TableRow>
          {winnerData && winnerData.map((data, index) => (
            <TableRow key={index}>
              <TableCell
                sx={{ borderBottom: "none", padding: "0", textAlign: "center" }}
              >
                <Typography
                  sx={{
                    color: "white",
                    fontSize: { xs: "14px", sm: "16px", md: "20px" },
                  }}
                >
                  {data.winCount}
                </Typography>
              </TableCell>
              <TableCell
                sx={{ borderBottom: "none", padding: "0", textAlign: "center" }}
              >
                <Typography
                  sx={{
                    color: "white",
                    fontSize: { xs: "14px", sm: "16px", md: "20px" },
                  }}
                >
                  {`${data.address.slice(0,4)}...${data.address.slice(-4)}`}
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
