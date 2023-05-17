import { Box, Button, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AppDispatch } from "state";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stackingMeow, unstackingMeow } from "store/slices/staking-slice";
import { useWeb3React } from "@web3-react/core";
import { IReduxState } from "store/slices/state.interface";

const meowTokenStyle = {
  color: "#BADA55",
  fontSize: { xs: "12px", sm: "16px" },
  mt: 1,
};

const jackpotStyle = {
  color: "white",
  fontSize: { xs: "12px", sm: "16px" }
}

const stakeButtonStyle = {
  paddingY: { xs: "4px", sm: "6px" },
  paddingX: { xs: "8px", sm: "16px" },
  fontSize: { xs: "12px", sm: "16px" },
  color: "black",
  backgroundColor: "#BADA55",
  fontFamily: "Audiowide",
  "&: hover": { backgroundColor: "#BADA55", opacity: 0.9 },
}

const MeowToken = () => {
  const { account } = useWeb3React();
  const [stackAmount, changesStack] = useState("");
  const [unstackAmount, changeUnstack] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  let stakeAmount: number = useSelector<IReduxState, number>(
    (state) => state.wallet.stakeAmount
  );
  const JackpotAmount = useSelector<IReduxState, string>(
    (state) => state.jackpot.jackpotAmount
  );
  let totalStake: number = useSelector<IReduxState, number>(
    (state) => state.wallet.totalStake
  );
  const meowCount: string = useSelector<IReduxState, string>(
    (state) => state.jackpot.meowCount
  );

  async function onStack() {
    if (parseInt(meowCount) < parseInt(stackAmount)) {
      alert("You don't have enough balance of Meow Token for stake!");
      return;
    }
    await dispatch(
      stackingMeow({
        amount: stackAmount,
        address: account,
      })
    );
  }

  async function onUnstack() {
    if (stakeAmount < parseInt(unstackAmount)) {
      alert("You don't have enough Meow Token to unstake!");
      return;
    }
    await dispatch(
      unstackingMeow({
        amount: unstackAmount,
        address: account,
      })
    );
  }

  return (
    <Box
      sx={{
        width: { xs: "320px", sm: "540px", md: "640px" },
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
          textAlign="center"
          color="#58C4E4"
          sx={{
            fontSize: { xs: "20px", sm: "28px", md: "36px", xl: "40px" },
            py: 1,
            px: { xs: 1, sm: 3 },
            mx: "auto",
            mb: 1,
          }}
        >
          Meow Token
        </Typography>
        <Typography
          sx={jackpotStyle}
        >
          Earn Meow each battle! Win or lose you mine one meow token.
        </Typography>
        <Typography
          fontFamily="Audiowide"
          sx={{
            color: "#6B81FF",
            fontSize: { xs: "14px", sm: "18px" },
            py: { xs: 1 },
            pl: { xs: 2, sm: 4, md: 6, xl: 8 },
          }}
        >
          24 Mined of 100,000,000 MOEW
        </Typography>
        <Typography
          sx={jackpotStyle}
        >
          Every time number 777 is randomly generated during a fight, users with
          staked Meow tokens split 40% of the Jackpot.
        </Typography>
        <Typography
          sx={jackpotStyle}
        >
          Passive Income!
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "flex-start",
          py: { xs: 1, sm: 2 },
          px: { xs: 1, sm: 2 },
          backgroundColor: "#6A6E64",
        }}
      >
        <Box>
          <Button
            sx={stakeButtonStyle}
            onClick={onStack}
          >
            Stake Meow
          </Button>
          <br />
          <TextField
            variant="outlined"
            type="number"
            size="small"
            sx={{ color: "white", width: "100%", mt: 2 }}
            value={stackAmount}
            onChange={(e) => {
              changesStack(e.target.value);
            }}
          />
          <Typography sx={meowTokenStyle}>
            Staked Meow: {stakeAmount ? stakeAmount : 0} Meow Token
          </Typography>
        </Box>
        <Box>
          <Button
            sx={stakeButtonStyle}
            onClick={onUnstack}
          >
            Unstake Meow
          </Button>
          <br />
          <TextField
            variant="outlined"
            size="small"
            type="number"
            sx={{ color: "white", width: "100%", mt: 2 }}
            value={unstackAmount}
            onChange={(e) => {
              changeUnstack(e.target.value);
            }}
          />
          <Typography sx={meowTokenStyle}>
            Available Meow: {meowCount}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1, backgroundColor: "#393D32" }}>
        <Typography
          sx={jackpotStyle}
        >
          Total Staked Meow in contract: {totalStake ? totalStake : 0} Meow
          Token
        </Typography>
        <Typography
          sx={jackpotStyle}
        >
          40% of current Jackpot:{" "}
          {JackpotAmount ? (parseInt(JackpotAmount) * 2) / 5 : 0} TRX
        </Typography>
      </Box>
      {/* <Box
        sx={{
          py: { xs: 1, sm: 2 },
          backgroundColor: "#6A6E64",
          paddingX: "6px",
        }}
      >
        <Typography sx={meowTokenStyle}>
          You share if Jackpot is triggered: 50% (504 TRX)
        </Typography>
        <Button
          sx={{
            fontSize: { xs: "12px", sm: "16px" },
            color: "black",
            backgroundColor: "white",
            paddingY: { xs: "4px", sm: "6px" },
            px: { xs: 3, sm: 5 },
            ml: { xs: 2, sm: 4 },
            my: 1,
            "&: hover": { backgroundColor: "white", opacity: 0.9 },
          }}
        >
          Claim
        </Button>
        <Typography sx={meowTokenStyle}>Unclaimed Earnings: 0 TRX</Typography>
      </Box> */}
    </Box>
  );
};

export default MeowToken;
