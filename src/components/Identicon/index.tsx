import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useActiveWeb3React } from "hooks";
import Jazzicon from "jazzicon";

export default function Identicon() {
  const ref = useRef<HTMLDivElement>();

  const { account } = useActiveWeb3React();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)));
    }
  }, [account]);

  return (
    <Box
      sx={{
        height: "16px",
        width: "16px",
        borderRadius: "50%",
      }}
      ref={ref as any}
    />
  );
}
