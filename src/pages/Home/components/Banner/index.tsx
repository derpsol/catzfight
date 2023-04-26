import { Box } from "@mui/material";
import "./banner.scss";
import BannerImage1 from "assets/images/ban1.png";
import BannerImage2 from "assets/images/ban2.png";

const Banner = () => {
  return (
    <>
      <Box className="banner-container">
        <Box
          component="img"
          sx={{
            width: { xs: "120px", sm: "150px" },
            mr: { xs: 1, sm: 2, md: 3 },
          }}
          src={BannerImage1}
          alt="Banner Image"
        />
        <Box
          component="img"
          sx={{ width: { xs: "120px", sm: "150px" } }}
          src={BannerImage2}
          alt="Banner Image"
        />
      </Box>
    </>
  );
};

export default Banner;
