import { CheckCircle, Triangle } from "react-feather";
import { Typography, Box, Link } from "@mui/material";
import Loader from "components/Loader";
import { useActiveWeb3React } from "hooks";
import { getEtherscanLink } from "utils";
import { useAllTransactions } from "state/transactions/hooks";

export default function Transaction({ hash }: { hash: string }) {
  const { chainId } = useActiveWeb3React();
  const allTransactions = useAllTransactions();

  const tx = allTransactions?.[hash];
  const summary = tx?.summary;
  const pending = !tx?.receipt;
  const success =
    !pending &&
    tx &&
    (tx.receipt?.status === 1 || typeof tx.receipt?.status === "undefined");

  if (!chainId) return null;

  return (
    <div>
      <Link
        href={getEtherscanLink(chainId, hash, "transaction")}
        target="_blank"
        rel="noreferrer"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textDecoration: "none",
          p: "4px 0",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        <Typography color="primary" fontSize="14px">
          {summary ?? hash} ↗
        </Typography>
        <Box>
          {pending ? (
            <Loader stroke="#6164ff" />
          ) : success ? (
            <CheckCircle size="16" color="#2e7d32" />
          ) : (
            <Triangle size="16" color="#d32f2f" />
          )}
        </Box>
      </Link>
    </div>
  );
}
