export const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "400px", sm: "500px", md: "700px", lg: "1000px" },
  height: "600px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  justifyContent: "space-around",
  flexWrap: "wrap",
  backgroundColor: "rgba(38,40,42)",
  borderRadius: 8,
  overflowY: "scroll",
};

export const roomStyle = {
  width: { xs: "120px", sm: "160px", md: "200px" },
  height: { xs: "120px", sm: "160px", md: "200px" },
  border: "4px solid #F39B33",
  borderRadius: { xs: "10px", sm: "15px", md: "20px" },
};

export const buttonStyle = {
  fontSize: { xs: "15px", sm: "18px" },
  border: "2px solid white",
  width: { xs: "120px", sm: "160px", md: "200px" },
  backgroundColor: "rgba(38,40,42,0.64)",
  paddingX: "0",
  textAlign: "center",
  minWidth: "60px",
  paddingY: { xs: "2px", sm: "4px" },
  mt: { xs: 1, sm: 2 },
  color: "#FF1E1E",
};

export const modalAvatarStyle = {
  width: {
    sx: "60px",
    sm: "100px",
    md: "150px",
    lg: "230px",
  },
  height: {
    sx: "60px",
    sm: "100px",
    md: "150px",
    lg: "230px",
  },
  borderRadius: '12px',
};
