import { Box, Typography } from "@mui/material";
// import ActionFeed from "./components/ActionFeed";
import Banner from "./components/Banner";
import Jackpot from "./components/Jackpot";
import CurrentBattle from "./components/CurrentBattle";

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
        <Box>
          <CurrentBattle />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
