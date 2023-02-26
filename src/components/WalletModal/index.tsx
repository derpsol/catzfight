import { AbstractConnector } from "@web3-react/abstract-connector";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { Dialog, Typography, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { isMobile } from "react-device-detect";
import ReactGA from "react-ga";
import AccountDetails from "components/AccountDetails";
import Option from "./Option";
import PendingView from "./PendingView";
import { SUPPORTED_WALLETS } from "../../constants";
import usePrevious from "hooks/usePrevious";
import { ApplicationModal } from "state/application/actions";
import { useModalOpen, useWalletModalToggle } from "state/application/hooks";

const WALLET_VIEWS = {
  OPTIONS: "options",
  OPTIONS_SECONDARY: "options_secondary",
  ACCOUNT: "account",
  PENDING: "pending",
};

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName,
}: {
  pendingTransactions: string[]; // hashes of pending
  confirmedTransactions: string[]; // hashes of confirmed
  ENSName?: string;
}) {
  // important that these are destructed from the account-specific web3-react context
  const { active, account, connector, activate, error } = useWeb3React();

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);

  const [pendingWallet, setPendingWallet] = useState<
    AbstractConnector | undefined
  >();

  const [pendingError, setPendingError] = useState<boolean>();

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET);
  const toggleWalletModal = useWalletModalToggle();

  const previousAccount = usePrevious(account);

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal();
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen]);

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false);
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [walletModalOpen]);

  // close modal when a connection is successful
  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);
  useEffect(() => {
    if (
      walletModalOpen &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [
    setWalletView,
    active,
    error,
    connector,
    walletModalOpen,
    activePrevious,
    connectorPrevious,
  ]);

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    let name = "";
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name);
      }
      return true;
    });
    // log selected wallet
    ReactGA.event({
      category: "Wallet",
      action: "Change Wallet",
      label: name,
    });
    setPendingWallet(connector); // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING);

    connector &&
      activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector); // a little janky...can't use setError because the connector isn't set
        } else {
          console.error(error);
          setPendingError(true);
        }
      });
  };

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key];
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector);
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            icon={require("../../assets/images/" + option.iconName).default}
          />
        )
      );
    });
  }

  function getModalContent() {
    if (error) {
      return (
        <Box>
          <IconButton className="close-icon" onClick={toggleWalletModal}>
            <CloseIcon />
          </IconButton>
          <Typography p="16px">
            {error instanceof UnsupportedChainIdError
              ? "Wrong Network"
              : "Error connecting"}
          </Typography>
          {error instanceof UnsupportedChainIdError ? (
            <Typography
              color="warning.main"
              sx={{ p: { xs: "16px", md: "32px" } }}
            >
              Please connect to the appropriate TRON network.
            </Typography>
          ) : (
            <Typography color="error" sx={{ p: { xs: "16px", md: "32px" } }}>
              Error connecting. Try refreshing the page.
            </Typography>
          )}
        </Box>
      );
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      );
    }
    return (
      <Box>
        <IconButton className="close-icon" onClick={toggleWalletModal}>
          <CloseIcon />
        </IconButton>
        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <Typography
            color="primary.main"
            p="16px"
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setPendingError(false);
              setWalletView(WALLET_VIEWS.ACCOUNT);
            }}
          >
            Back
          </Typography>
        ) : (
          <Typography p="16px" sx={{ cursor: "pointer" }}>
            Connect to a wallet
          </Typography>
        )}
        <Box sx={{ p: { xs: "16px", md: "32px" } }}>
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <Box>{getOptions()}</Box>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Dialog
      open={walletModalOpen}
      onClose={toggleWalletModal}
      sx={{
        "> .MuiDialog-container": {
          "> .MuiPaper-root": {
            maxWidth: "420px",
            width: { xs: "100%", sm: "70%", md: "50%" },
          },
        },
      }}
    >
      {getModalContent()}
    </Dialog>
  );
}
