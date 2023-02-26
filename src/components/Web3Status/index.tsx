import { AbstractConnector } from "@web3-react/abstract-connector";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import { Activity } from "react-feather";
import { Button, Typography } from "@mui/material";
import { injected } from "connectors";
import { NetworkContextName } from "../../constants";
import useENSName from "hooks/useENSName";
import { useWalletModalToggle } from "state/application/hooks";
import {
  isTransactionRecent,
  useAllTransactions,
} from "state/transactions/hooks";
import { TransactionDetails } from "state/transactions/reducer";
import { shortenAddress } from "utils";
import Identicon from "components/Identicon";
import Loader from "components/Loader";
import WalletModal from "components/WalletModal";
import "./web3-status.scss";

function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime;
}

const SOCK = (
  <span
    role="img"
    aria-label="has socks emoji"
    style={{ marginTop: -4, marginBottom: -4 }}
  >
    🧦
  </span>
);

function StatusIcon({ connector }: { connector: AbstractConnector }) {
  console.log("connector", connector);
  console.log(connector === injected);
  if (connector === injected) {
    return <Identicon />;
  }
  return null;
}

function Web3StatusInner() {
  const { account, connector, error } = useWeb3React();
  const { ENSName } = useENSName(account ?? undefined);

  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);

  const hasPendingTransactions = !!pending.length;
  const hasSocks = null;
  const toggleWalletModal = useWalletModalToggle();

  if (account) {
    return (
      <Button variant="contained" color="primary" onClick={toggleWalletModal}>
        {hasPendingTransactions ? (
          <>
            <Typography mr="8px">{pending?.length} Pending</Typography>{" "}
            <Loader />
          </>
        ) : (
          <>
            {hasSocks ? SOCK : null}
            <Typography mr="8px" ml="4px">
              {ENSName || shortenAddress(account)}
            </Typography>
          </>
        )}
        {!hasPendingTransactions && connector && (
          <StatusIcon connector={connector} />
        )}
      </Button>
    );
  } else if (error) {
    return (
      <Button variant="contained" color="error" onClick={toggleWalletModal}>
        <Activity className="network-icon" />
        <Typography ml="4px">
          {error instanceof UnsupportedChainIdError ? "Wrong Network" : "Error"}
        </Typography>
      </Button>
    );
  } else {
    return (
      <>
        <Button variant="contained" color="primary" onClick={toggleWalletModal}>
          Connect Wallet
        </Button>
      </>
    );
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React();
  const contextNetwork = useWeb3React(NetworkContextName);

  const { ENSName } = useENSName(account ?? undefined);

  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);
  const confirmed = sortedRecentTransactions
    .filter((tx) => tx.receipt)
    .map((tx) => tx.hash);

  // if (!contextNetwork.active && !active) {
  //   return null;
  // }

  return (
    <>
      <Web3StatusInner />
      <WalletModal
        ENSName={ENSName ?? undefined}
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
      />
    </>
  );
}
