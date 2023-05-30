import { Box, Typography } from "@mui/material";
import { IReduxState } from "store/slices/state.interface";
import { useSelector } from "react-redux";
import { randomDataStyle } from "@types";

const Role = () => {
  const randomData: randomDataStyle[] = useSelector<
    IReduxState,
    randomDataStyle[]
  >((state) => state.random.randomData);

  return (
    <Box
      sx={{
        paddingX: "6px",
        mt: { xs: 2, sm: 4, md: 6, xl: 8 },
        pb: 1,
      }}
    >
      <Typography
        fontFamily="Audiowide"
        sx={{
          fontSize: { xs: "24px", sm: "30px" },
          color: "white",
          textAlign: "center",
          py: { xs: 1, sm: 2, md: 3, xl: 4 },
          mb: { xs: 1, sm: 2, md: 3, xl: 4 },
        }}
      >
        Numbers Rolled
      </Typography>
      <Box display='flex' justifyContent='space-around' flexWrap='wrap'>
        {randomData &&
          randomData.map((data, index) => (
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
    </Box>
  );
};

export default Role;
