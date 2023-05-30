import { Box, Typography } from "@mui/material";
import Role from "./Role";
import FinishedBattle from "./FinishedBattle";
import Winner from "./Winner";
import MyResult from "./MyResult";

const Result = () => {
  return (
    <Box minHeight='100vh' sx={{ backgroundColor: "#111B24" }}>
      <Winner />
      <Role />
      <FinishedBattle />
      <MyResult />
    </Box>
  );
};

export default Result;
