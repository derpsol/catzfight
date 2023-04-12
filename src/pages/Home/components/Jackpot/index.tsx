import { Box, Button, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { IReduxState } from "../../../../store/slices/state.interface";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "state";
import { useWeb3React } from "@web3-react/core";
import { claimMoney, widrawNFT } from "store/slices/play-slice";
import { useEffect } from "react";
import { walletInfo } from "store/slices/walletInfo-slice";

const availableStyle = {
  paddingY: "4px",
  textAlign: "center",
  fontSize: "18px",
  color: "#F39B33",
};

const Jackpot = () => {
  const { account } = useWeb3React();

  const JackpotAmount = useSelector<IReduxState, string>(
    (state) => state.app.jackpotAmount
  );
  const meowCount: string = useSelector<IReduxState, string>(
    (state) => state.app.meowCount
  );
  let contractNFTs: number = useSelector<IReduxState, number>(
    (state) => state.wallet.nftCount
  );
  let widrawAmount: number = useSelector<IReduxState, number>(
    (state) => state.wallet.trxAmount
  );

  const history = useHistory();
  const handleClickStake = (link: string) => {
    history.push(link);
  };

  const dispatch = useDispatch<AppDispatch>();

  async function onWidrawNFT() {
    let widrawState = await dispatch(widrawNFT({ address: account }));
    if (widrawState.meta.requestStatus === "fulfilled") {
      getAvailableData();
    }
  }

  async function onClaimMoney() {
    let claimState = await dispatch(claimMoney({ address: account }));
    if (claimState.meta.requestStatus === "fulfilled") {
      getAvailableData();
    }
  }

  function getAvailableData() {
    dispatch(walletInfo({ account: account }));
  }

  useEffect(() => {
    if (account) {
      getAvailableData();
    }
  }, [account]);

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
          width: { xs: "400px", sm: "615px" },
          textAlign: "center",
          mx: "auto",
        }}
      >
        War Chest Jackpot: {JackpotAmount} TRX
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
        <Box sx={{ mr: 3, textAlign: "center" }}>
          <Button
            sx={{
              paddingX: "16px",
              paddingY: "6px",
              marginTop: "8px",
              fontSize: "18px",
              color: "#52b202",
              backgroundColor: "#d0e7b7",
            }}
            onClick={() => {
              onWidrawNFT();
            }}
          >
            Withdraw NFTs
          </Button>
          <Typography sx={availableStyle}>
            Available NFTs: {contractNFTs ? contractNFTs : 0} NFTs
          </Typography>
        </Box>
        <Box sx={{ mr: 3, textAlign: "center" }}>
          <Button
            sx={{
              paddingX: "16px",
              paddingY: "6px",
              marginTop: "8px",
              fontSize: "18px",
              color: "#52b202",
              backgroundColor: "#d0e7b7",
            }}
            onClick={() => {
              onClaimMoney();
            }}
          >
            Withdraw TRX
          </Button>
          <Typography sx={availableStyle}>
            Available TRX: {widrawAmount ? widrawAmount : 0} TRX
          </Typography>
        </Box>
        <Box sx={{ mr: 3 }}>
          <Button
            sx={{
              borderRadius: "24px",
              paddingX: "16px",
              paddingY: "6px",
              border: "1px solid white",
              color: "white",
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
          <Typography sx={availableStyle}>
            Available Meow: {meowCount}
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
          width: { xs: "400px", xl: "600px" },
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
