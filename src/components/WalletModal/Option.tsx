import { Box, Typography } from "@mui/material";

export default function Option({
  clickable = true,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id,
}: {
  clickable?: boolean;
  onClick?: null | (() => void);
  color: string;
  header: React.ReactNode;
  subheader: React.ReactNode | null;
  icon: string;
  active?: boolean;
  id: string;
}) {
  const content = (
    <Box
      className="option-card-clickable"
      onClick={onClick ? onClick : () => {}}
      sx={{
        backgroundColor: active ? "#EDEEF2" : "#ffffff",
        borderColor: active ? "transparent" : "#EDEEF2",
        "&:hover": {
          cursor: clickable ? "pointer" : "",
          border: clickable ? `1px solid #6164ff` : ``,
        },
      }}
    >
      <Box>
        <Box
          sx={{
            color,
            display: "flex",
            alignItems: "center",
          }}
        >
          {!active && <Box className="green-circle" />}
          {header}
        </Box>
        {subheader && (
          <Typography fontSize="12px" mt="10px">
            {subheader}
          </Typography>
        )}
      </Box>
      <Box
        component="img"
        src={icon}
        alt={"Icon"}
        sx={{ width: "24px", height: "24px" }}
      />
    </Box>
  );

  return content;
}
