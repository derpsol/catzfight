import { Box, Typography } from "@mui/material";
import { CheckCircle, Copy } from "react-feather";
import useCopyClipboard from "hooks/useCopyClipboard";

export default function CopyHelper(props: {
  toCopy: string;
  children?: React.ReactNode;
}) {
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <Box className="copy-icon" onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
        <>
          <CheckCircle size={"16"} />
          <Typography component="span" ml="4px" fontSize="14px">
            Copied
          </Typography>
        </>
      ) : (
        <>
          <Copy size={"16"} />
          {props.children}
        </>
      )}
    </Box>
  );
}
