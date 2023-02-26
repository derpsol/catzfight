import { Box, Button, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { IReduxState } from "../../../../store/slices/state.interface";
import { useSelector } from "react-redux";

const Jackpot = () => {
  const JackpotAmount = useSelector<IReduxState, string>(
    (state) => state.app.jackpotAmount
  );

  const history = useHistory();
  const handleClickStake = (link: string) => {
    history.push(link);
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgba(230,239,237, 0.1)",
        paddingY: "3px",
        position: "relative",
      }}
    >
      <Typography
        fontFamily="Audiowide"
        sx={{
          color: "#FF1E1E",
          fontSize: { xs: "24px", sm: "30px" },
          py: 1,
          px: { xs: 1, sm: 3 },
          backgroundColor: "rgba(38,40,42,0.64)",
          width: { xs: "450px", sm: "615px" },
          textAlign: "center",
          mx: "auto",
        }}
      >
        War Chest Jackpot: {JackpotAmount} Ether
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "self-start",
          pb: 6,
        }}
      >
        <Box>
          <Box>
            <Button
              sx={{
                paddingX: "16px",
                paddingY: "6px",
                marginTop: "8px",
                fontSize: "18px",
                mr: 3,
                color: "rgba(101,230,255,1)",
                backgroundColor: "rgba(101,230,255,0.15)",
              }}
            >
              Deposit
            </Button>
          </Box>
        </Box>
        <Button
          sx={{
            paddingX: "16px",
            paddingY: "6px",
            marginTop: "8px",
            fontSize: "18px",
            mr: 3,
            color: "#52b202",
            backgroundColor: "#d0e7b7",
          }}
        >
          Withdraw
        </Button>
        <Box sx={{ mr: 3 }}>
          <Button
            sx={{
              borderRadius: "24px",
              paddingX: "16px",
              paddingY: "6px",
              border: "1px solid white",
              color: "white",
              // backgroundColor: "rgba(38,40,42,0.64)",
              mx: "auto",
              fontSize: "18px",
              marginTop: "8px",
              display: "block",
            }}
            onClick={() => {
              handleClickStake("stake");
            }}
          >
            Meow Staking
          </Button>
          <Typography
            sx={{
              paddingY: "4px",
              textAlign: "center",
              fontSize: "18px",
              color: "#F39B33",
            }}
          >
            Available Meow: 2
          </Typography>
        </Box>
      </Box>
      <Typography
        fontFamily="Audiowide"
        sx={{
          color: "#fff",
          fontSize: { xs: "20px", xl: "24px" },
          py: 1,
          px: { xs: 1, xl: 2 },
          backgroundColor: "rgba(38,40,42,0.64)",
          width: { xs: "450px", xl: "600px" },
          textAlign: "center",
          position: { md: "absolute" },
          mx: "auto",
          left: "6px",
          bottom: "6px",
        }}
      >
        MEOW left to be mined: 99,999,980
      </Typography>
    </Box>
  );
};

export default Jackpot;
