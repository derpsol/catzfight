import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ExternalLink as LinkIcon } from "react-feather";
import { Box, Typography, Button, Link, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ethAddress } from "@intercroneswap/java-tron-provider";
import Identicon from "components/Identicon";
import Copy from "./Copy";
import Transaction from "./Transaction";
import { SUPPORTED_WALLETS } from "../../constants";
import { injected } from "connectors";
import { useActiveWeb3React } from "hooks";
import { AppDispatch } from "state";
import { clearAllTransactions } from "state/transactions/actions";
import { shortenAddress, getEtherscanLink } from "utils";

function renderTransactions(transactions: string[]) {
  return (
    <Box>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />;
      })}
    </Box>
  );
}

interface AccountDetailsProps {
  toggleWalletModal: () => void;
  pendingTransactions: string[];
  confirmedTransactions: string[];
  ENSName?: string;
  openOptions: () => void;
}

export default function AccountDetails({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions,
}: AccountDetailsProps) {
  const { chainId, account, connector } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();

  function formatConnectorName() {
    const name = Object.keys(SUPPORTED_WALLETS).map(
      (k) => SUPPORTED_WALLETS[k].name
    )[0];
    return (
      <Typography color="#888d9b" fontSize="14px">
        Connected with {name}
      </Typography>
    );
  }

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <Box mr="8px">
          <Identicon />
        </Box>
      );
    }
    return null;
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }));
  }, [dispatch, chainId]);

  return (
    <>
      <Box>
        <IconButton className="close-icon" onClick={toggleWalletModal}>
          <CloseIcon />
        </IconButton>
        <Typography p="16px">Account</Typography>
        <Box p="0 16px 24px 16px">
          <Box className="info-card" p="16px">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {formatConnectorName()}
              <Button
                variant="outlined"
                sx={{ fontSize: "12px", lineHeight: "1.5", p: "4px 6px" }}
                onClick={() => {
                  openOptions();
                }}
              >
                Change
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {ENSName ? (
                  <>
                    {getStatusIcon()}
                    <Typography fontSize="20px"> {ENSName}</Typography>
                  </>
                ) : (
                  <>
                    {getStatusIcon()}
                    <Typography fontSize="20px">
                      {" "}
                      {account && shortenAddress(account)}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {account && (
                  <Copy toCopy={ethAddress.toTron(account)}>
                    <Typography component="span" ml="4px" fontSize="14px">
                      Copy Address
                    </Typography>
                  </Copy>
                )}
                {chainId && account && (
                  <Link
                    className="address-link"
                    href={getEtherscanLink(
                      chainId,
                      ENSName ? ENSName : account,
                      "address"
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LinkIcon size={16} />
                    <Typography component="span" ml="4px" fontSize="14px">
                      View on Tronscan
                    </Typography>
                  </Link>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <Box p="16px 24px">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            mb="16px"
          >
            <Typography>Recent Transactions</Typography>
            <Button
              size="small"
              variant="text"
              onClick={clearAllTransactionsCallback}
              sx={{ textTransform: "lowercase" }}
            >
              (clear all)
            </Button>
          </Box>
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
        </Box>
      ) : (
        <Typography p="16px 24px">
          Your transactions will appear here...
        </Typography>
      )}
    </>
  );
}
