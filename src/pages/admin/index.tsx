import { useCallback, useEffect } from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { loadWaitingDetails } from "store/slices/getnft-slice";
import { AppDispatch } from "state";
import Waiting from "./components/waiting";
import Approve from "./components/approve";

function Admin() {
  const dispatch = useDispatch<AppDispatch>();

  const loadData = useCallback(() => {
    dispatch(
      loadWaitingDetails({
        waitingList: [],
        approvedList: [],
      })
    );
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#111B24",
      }}
      minHeight="100vh"
    >
      <Waiting />
      <Approve />
    </Box>
  );
}

export default Admin;
