import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { IReduxState } from "store/slices/state.interface";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "state";
import { useWeb3React } from "@web3-react/core";
import { claimMoney, widrawNFT } from "store/slices/play-slice";
import { useCallback, useEffect } from "react";
import { walletInfo } from "store/slices/walletInfo-slice";
import React from "react";
import { AddNft } from "store/slices/addnft-slice";

const availableStyle = {
  paddingY: "4px",
  textAlign: "center",
  fontSize: "18px",
  color: "#F39B33",
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  backgroundColor: "rgba(38,40,42)",
  border: "none",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const Jackpot = () => {
  const { account } = useWeb3React();
  const [open, setOpen] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch<AppDispatch>();

  const JackpotAmount = useSelector<IReduxState, string>(
    (state) => state.jackpot.jackpotAmount
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

  const getAvailableData = useCallback(() => {
    dispatch(walletInfo({ account: account }));
  }, [account]);

  const onWidrawNFT = useCallback(async () => {
    let widrawState = await dispatch(widrawNFT({ address: account }));
    if (widrawState.meta.requestStatus === "fulfilled") {
      getAvailableData();
    }
  }, [account]);

  const onClaimMoney = useCallback(async () => {
    let claimState = await dispatch(claimMoney({ address: account }));
    if (claimState.meta.requestStatus === "fulfilled") {
      getAvailableData();
    }
  }, [account]);

  useEffect(() => {
    if (account) {
      getAvailableData();
    }
  }, [account]);

  const handleRequest = useCallback(async () => {
    await dispatch(AddNft({ address: walletAddress }));
  }, [walletAddress]);

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
          width: { xs: "320px", sm: "615px" },
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
          mt: "12px",
        }}
      >
        <Box sx={{ mr: 3, textAlign: "center" }}>
          <Button onClick={handleOpen} variant="contained" color="success">
            NFT Request
          </Button>
        </Box>
        <Box sx={{ mr: 3, textAlign: "center" }}>
          <Button variant="contained" color="info" onClick={onWidrawNFT}>
            Withdraw NFTs
          </Button>
          <Typography sx={availableStyle}>
            Available NFTs: {contractNFTs ? contractNFTs : 0} NFTs
          </Typography>
        </Box>
        <Box sx={{ mr: 3, textAlign: "center" }}>
          <Button variant="contained" color="info" onClick={onClaimMoney}>
            Withdraw TRX
          </Button>
          <Typography sx={availableStyle}>
            Available TRX: {widrawAmount ? widrawAmount : 0} TRX
          </Typography>
        </Box>
        <Box sx={{ mr: 3, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleClickStake("stake");
            }}
          >
            Meow Staking
          </Button>
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
          width: { xs: "320px", sm: "450px", xl: "600px" },
          textAlign: "center",
          position: { md: "absolute" },
          mx: "auto",
          left: "6px",
          bottom: "6px",
        }}
      >
        MEOW left to be mined: 99,999,980
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            color="white"
            fontFamily="Georgia"
            fontWeight="700"
            fontSize="30px"
          >
            Please insert NFT Address
          </Typography>
          <TextField
            sx={{
              mt: "20px",
              width: "100%",
            }}
            value={walletAddress}
            onChange={(e) => {
              setWalletAddress(e.target.value);
            }}
          />
          <Button
            variant="contained"
            color="info"
            sx={{
              mt: "20px",
              width: "50%",
            }}
            onClick={() => {
              handleRequest();
              handleClose();
            }}
          >
            Send Reqeust
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Jackpot;
