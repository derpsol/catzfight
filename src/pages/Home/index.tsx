import { Box, Typography } from "@mui/material";
// import ActionFeed from "./components/ActionFeed";
import Banner from "./components/Banner";
import Jackpot from "./components/Jackpot";
import Role from "./components/Role";
import Winner from "./components/Winner";
import CurrentBattle from "./components/CurrentBattle";
import FinishedBattle from "./components/FinishedBattle";

const Home = () => {
  return (
    <Box sx={{ backgroundColor: "rgba(38,40,42,0.95)" }}>
      <Banner />
      <Typography
        variant="h2"
        textAlign="center"
        fontFamily="Audiowide"
        color="white"
        sx={{
          fontSize: { xs: "24px", md: "48px", xl: "60px" },
          mt: "16px",
          mb: "16px",
        }}
      >
        Crypto Moon Catz War!
      </Typography>
      <Jackpot />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-around",
          my: { xs: 1, sm: 2 },
        }}
      >
        <Box sx={{ width: { xs: "100%", lg: "13%" } }}>
          <Role />
        </Box>
        <Box sx={{ width: { xs: "100%", lg: "66%" } }}>
          <CurrentBattle />
          <FinishedBattle />
        </Box>
        <Box sx={{ width: { xs: "100%", lg: "15%" } }}>
          <Winner />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
