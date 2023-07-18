import { Box, Typography } from "@mui/material";

const ChestInfo = () => {
  return (
    <Box
      sx={{
        width: { xs: "320px", sm: "540px", md: "640px" },
        mt: { xs: 4, sm: 6, md: 8, xl: 10 },
        marginX: "auto",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#393D32",
          pb: { xs: 1, sm: 2, md: 3, xl: 4 },
          px: 2,
        }}
      >
        <Typography
          fontFamily="Audiowide"
          sx={{
            color: "white",
            fontSize: { xs: "20px", sm: "28px", md: "36px", xl: "40" },
            py: 1,
            px: { xs: 1, sm: 3 },
            textAlign: "center",
            mx: "auto",
            mb: 1,
          }}
        >
          War Chest
        </Typography>
        <Typography
          sx={{ fontSize: { xs: "12px", sm: "16px" }, color: "white", py: 1 }}
        >
          Battle players for NFTs and a chance at opening the War Chest Jackpot!
        </Typography>
        <Typography
          sx={{ fontSize: { xs: "12px", sm: "16px" }, color: "white", pt: 2 }}
        >
          Each battle 2 users put up 1 Crypto Moon Catz NFT and 50 TRX each.
        </Typography>
        <Typography
          sx={{ fontSize: { xs: "12px", sm: "16px" }, color: "white", pt: 1 }}
        >
          Users are the given a random nuber (1-1,000) Highest number wins!
        </Typography>
        <Typography
          sx={{ fontSize: { xs: "12px", sm: "16px" }, color: "#BADA55", pt: 2 }}
        >
          Winner receives both NFT's and 60 TRX + (1 Meow token)
        </Typography>
        <Typography
          sx={{ color: "#FF1313", fontSize: { xs: "12px", sm: "16px", pt: 1 } }}
        >
          Loser receives (1 Meow token)
        </Typography>
        <Typography
          sx={{ color: "#FF1313", fontSize: { xs: "12px", sm: "16px", pt: 1 } }}
        >
          Loser 30 TRX is sent to the War Chest Jackpot until 777 is rolled!
        </Typography>
        <Typography
          sx={{ color: "#FF1313", fontSize: { xs: "12px", sm: "16px", pt: 1 } }}
        >
          10 TRX sent to team account
        </Typography>
      </Box>
      <Box sx={{ py: { xs: 1, sm: 2 }, backgroundColor: "#6A6E64", px: 2 }}>
        <Typography
          sx={{ color: "#F39B33", fontSize: { xs: "14px", sm: "18px" } }}
        >
          War Chest Jackpot distribution:
        </Typography>
        <Typography
          sx={{ color: "#F39B33", fontSize: { xs: "12px", sm: "16px" }, tp: 1 }}
        >
          40% goes to who rolled 777
        </Typography>
        <Typography
          sx={{ color: "#F39B33", fontSize: { xs: "12px", sm: "16px" }, tp: 1 }}
        >
          10% goes to other user in that battle
        </Typography>
        <Typography
          sx={{ color: "#F39B33", fontSize: { xs: "12px", sm: "16px" }, tp: 1 }}
        >
          40% goes to all users that have Meow tokens staked
        </Typography>
        <Typography
          sx={{ color: "#F39B33", fontSize: { xs: "12px", sm: "16px" }, tp: 1 }}
        >
          10% remains in the jackpot
        </Typography>
      </Box>
    </Box>
  );
};

export default ChestInfo;
