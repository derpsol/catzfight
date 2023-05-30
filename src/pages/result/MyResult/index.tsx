import { Box, Skeleton, Typography } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { IReduxState } from "store/slices/state.interface";
import { useSelector } from "react-redux";

const MyResult = () => {
  const resultData: any[] = useSelector<IReduxState, any[]>(
    (state) => state.result.myResultData
  );

  return (
    <Box
      sx={{
        paddingX: "6px",
        mt: { xs: 2, sm: 4, md: 6, xl: 8 },
        pb: { xs: 2, sm: 4, md: 6, xl: 8 },
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
        My Results (Last 20 battles)
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        {resultData && resultData.map((data, index) => {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                mr: { xs: 2, sm: 3 },
                mb: { xs: 1, sm: 2, md: 3, lg: 4 },
              }}
              key={index}
            >
              <Box
                sx={{
                  marginRight: { xs: "6px", sm: "8px", md: "12px", xl: "16px" },
                }}
              >
                <Typography
                  sx={{
                    color: "white",
                    fontSize: { xs: "15px", sm: "18px" },
                    mb: 1,
                    textAlign: "center",
                  }}
                >
                  {data.randomNumber1}
                </Typography>
                {data.nftUrl1 ? (
                  <Box
                    component="img"
                    sx={{ width: { xs: "120px", sm: "160px", md: "200px" } }}
                    src={data.nftUrl1}
                    alt="Battle Image"
                    borderRadius='12px'
                  />
                ) : (
                  <Skeleton
                    sx={{
                      width: { xs: "120px", sm: "160px", md: "200px" },
                      height: { xs: "120px", sm: "160px", md: "200px" },
                    }}
                  />
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: data.randomNumber1 > data.randomNumber2 ? "space-between" : 'center',
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: { xs: "15px", sm: "18px" },
                      mt: 1,
                      textAlign: "center",
                    }}
                  >
                    {`${data.address1.slice(0, 4)}...${data.address1.slice(
                      -4
                    )}`}
                  </Typography>
                  {data.randomNumber1 > data.randomNumber2 ? (
                    <TaskAltIcon
                      sx={{
                        color: "green",
                        fontSize: { xs: "21px", sm: "24px" },
                      }}
                    />
                  ) : null}
                </Box>
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: "white",
                    fontSize: { xs: "12px", sm: "18px" },
                    mb: 1,
                    textAlign: "center",
                  }}
                >
                  {data.randomNumber2}
                </Typography>
                {data.nftUrl2 ? (
                  <Box
                    component="img"
                    sx={{ width: { xs: "120px", sm: "160px", md: "200px" } }}
                    src={data.nftUrl2}
                    alt="Battle Image"
                    borderRadius='12px'
                  />
                ) : (
                  <Skeleton
                    sx={{
                      width: { xs: "120px", sm: "160px", md: "200px" },
                      height: { xs: "120px", sm: "160px", md: "200px" },
                    }}
                  />
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: data.randomNumber1 < data.randomNumber2 ? "space-between" : 'center',
                    alignItems: "center",
                    pt: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: { xs: "12px", sm: "18px" },
                      textAlign: "center",
                    }}
                  >
                    {`${data.address2.slice(0, 4)}...${data.address2.slice(
                      -4
                    )}`}
                  </Typography>
                  {data.randomNumber1 < data.randomNumber2 ? (
                    <TaskAltIcon
                      sx={{
                        color: "green",
                        fontSize: { xs: "21px", sm: "24px" },
                      }}
                    />
                  ) : null}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default MyResult;
