import { AbstractConnector } from "@web3-react/abstract-connector";
import { Box, Button, Typography } from "@mui/material";
import Loader from "components/Loader";
import Option from "./Option";
import { SUPPORTED_WALLETS } from "../../constants";

export default function PendingView({
  connector,
  error = false,
  setPendingError,
  tryActivation,
}: {
  connector?: AbstractConnector;
  error?: boolean;
  setPendingError: (error: boolean) => void;
  tryActivation: (connector: AbstractConnector) => void;
}) {
  return (
    <Box>
      <Box
        mb="20px"
        sx={{
          borderRadius: "12px",
          border: `1px solid ${error ? "#FF6871" : "#C3C5CB"}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }} p="16px">
          {error ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography color="#FF6871">Error connecting.</Typography>
              <Button
                size="small"
                variant="contained"
                sx={{
                  backgroundColor: "#ced0d9",
                  color: "#000000",
                  lineHeight: "1.5",
                  ml: "8px",
                  "&:hover": {
                    backgroundColor: "#a8abb3",
                  },
                }}
                onClick={() => {
                  setPendingError(false);
                  connector && tryActivation(connector);
                }}
              >
                Try Again
              </Button>
            </Box>
          ) : (
            <>
              <Loader stroke="#000" />
              <Typography ml="8px">Initializing...</Typography>
            </>
          )}
        </Box>
      </Box>
      {Object.keys(SUPPORTED_WALLETS).map((key) => {
        const option = SUPPORTED_WALLETS[key];
        if (option.connector === connector) {
          return (
            <Option
              id={`connect-${key}`}
              key={key}
              clickable={false}
              color={option.color}
              header={option.name}
              subheader={option.description}
              icon={require("../../assets/images/" + option.iconName).default}
            />
          );
        }
        return null;
      })}
    </Box>
  );
}
