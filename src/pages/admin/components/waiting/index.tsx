import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "store/slices/state.interface";
import { AppDispatch } from "state";
import { ApproveNft, DeleteWaiting } from "store/slices/addnft-slice";
import { loadWaitingDetails } from "store/slices/getnft-slice";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  backgroundColor: "rgba(38,40,42)",
  border: "none",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

function Waiting() {
  const waitings: any[] = useSelector<IReduxState, any[]>(
    (state) => state.waiting.waitingList
  );
  const [open, setOpen] = React.useState(false);
  const [address, setAddress] = React.useState("");
  const [name, setName] = React.useState("");
  const [symbol, setSymbol] = React.useState("");
  const [created, setCreated] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleApprove = useCallback(async (address: string, name: string, symbol: string) => {
    await dispatch(ApproveNft({ address: address, name: name, symbol: symbol }));
    dispatch(loadWaitingDetails({
      waitingList: [],
      approvedList: []
    }));
  }, []);

  const handleDecline = useCallback(async (address: string) => {
    await dispatch(DeleteWaiting({ address: address }));
    dispatch(loadWaitingDetails({
      waitingList: [],
      approvedList: []
    }));
  }, []);

  return (
    <Box>
      <Typography
        fontSize="40px"
        fontWeight="700"
        color="white"
        textAlign="center"
        pt="24px"
        pb="24px"
      >
        Waiting List
      </Typography>
      <Box>
        <Table sx={{ minWidth: 320 }} aria-label="simple table">
          {waitings.length !== 0 ? (
            <>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      display: { xs: "none", sm: "table-cell" },
                    }}
                    align="center"
                  >
                    <Typography color="white">No</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="white">Address</Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      display: { xs: "none", md: "table-cell" },
                    }}
                    align="center"
                  >
                    <Typography color="white">Name</Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      display: { xs: "none", md: "table-cell" },
                    }}
                    align="center"
                  >
                    <Typography color="white">Symbol</Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      display: { xs: "none", lg: "table-cell" },
                    }}
                    align="center"
                  >
                    <Typography color="white">Created At</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography color="white">Approve</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {waitings.map((waiting, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      sx={{
                        display: { xs: "none", sm: "table-cell" },
                      }}
                      component="th"
                      scope="row"
                      align="center"
                    >
                      <Typography color="white">{index + 1}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          wordBreak: "break-all",
                        }}
                        color="white"
                      >
                        {waiting.address}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: { xs: "none", md: "table-cell" },
                      }}
                      align="center"
                    >
                      <Typography
                        sx={{
                          wordBreak: "break-all",
                        }}
                        color="white"
                      >
                        {waiting.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: { xs: "none", md: "table-cell" },
                      }}
                      align="center"
                    >
                      <Typography
                        sx={{
                          wordBreak: "break-all",
                        }}
                        color="white"
                      >
                        {waiting.symbol}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: { xs: "none", lg: "table-cell" },
                      }}
                      align="center"
                    >
                      <Typography color="white">{waiting.createdAt}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="success"
                        sx={{
                          mr: "12px",
                          display: { xs: "none", sm: "inline-flex" },
                        }}
                        onClick={() => {
                          handleApprove(waiting.address, waiting.name, waiting.symbol);
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        sx={{
                          marginTop: { xs: "8px", sm: "0px" },
                          display: { xs: "none", sm: "inline-flex" },
                        }}
                        onClick={() => {
                          handleDecline(waiting.address);
                        }}
                      >
                        Decline
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{
                          mr: "12px",
                          display: { xs: "block", sm: "none" },
                        }}
                        onClick={() => {
                          handleOpen();
                          setAddress(waiting.address);
                          setName(waiting.name);
                          setSymbol(waiting.symbol);
                          setCreated(waiting.createdAt);
                        }}
                      >
                        Show Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          ) : (
            <Typography color="white" fontSize="32px" textAlign="center">
              You have no waiting NFT address for approving
            </Typography>
          )}
        </Table>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{
              wordBreak: "break-all",
            }}
            color="white"
            textAlign='center'
          >
            Address: {address}
          </Typography>
          <Typography
            sx={{
              wordBreak: "break-all",
              mt: '12px'
            }}
            color="white"
            textAlign='center'
          >
            Name: {name}
          </Typography>
          <Typography
            sx={{
              wordBreak: "break-all",
              mt: '12px'
            }}
            color="white"
            textAlign='center'
          >
            Symbol: {symbol}
          </Typography>
          <Typography
            sx={{
              wordBreak: "break-all",
              mt: '12px'
            }}
            color="white"
            textAlign='center'
          >
            CreatedAt: {created}
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{
              mt: "20px",
              width: "50%",
            }}
            onClick={() => {
              handleApprove(address, name, symbol);
              handleClose();
            }}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="warning"
            sx={{
              mt: "20px",
              width: "50%",
            }}
            onClick={() => {
              handleDecline(address);
              handleClose();
            }}
          >
            Decline
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Waiting;
