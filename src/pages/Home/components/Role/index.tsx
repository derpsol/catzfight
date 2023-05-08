import { Box, Typography } from "@mui/material";
import { IReduxState } from "store/slices/state.interface";
import { useSelector } from "react-redux";
import { randomDataStyle } from "@types";

const Role = () => {
  const randomData: randomDataStyle[] = useSelector<IReduxState, randomDataStyle[]>(
    (state) => state.random.randomData
  );

  return (
    <Box
      sx={{
        backgroundColor: "rgba(230,239,237, 0.1)",
        paddingX: "6px",
        mt: { xs: 2, sm: 4, md: 6, xl: 8 },
        pb: 1,
      }}
    >
      <Typography
        fontFamily="Audiowide"
        sx={{
          fontSize: { xs: "18px", sm: "25px" },
          color: "#F39B33",
          py: { xs: 1, md: 2 },
          textAlign: "center",
        }}
      >
        Numbers Rolled:
      </Typography>
      {randomData && randomData.map((data, index) => (
        <Box key={index}>
          <Typography
            sx={{
              color: "white",
              fontSize: { xs: "14px", sm: "16px", md: "20px" },
              lineHeight: "1.3",
              textAlign: "center",
            }}
          >
            {data.randomNumber1}
          </Typography>
          <Typography
            sx={{
              color: "white",
              fontSize: { xs: "14px", sm: "16px", md: "20px" },
              lineHeight: "1.3",
              textAlign: "center",
            }}
          >
            {data.randomNumber2}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Role;
