export const fightStyle = {
  fontSize: { xs: "32px", sm: "34px", md: "50px" },
  fontFamily: "Georgia",
  fontWeight: "900",
  color: "white",
  lineHeight: { xs: "32px", sm: "40px", md: "64px" },
  textAlign: "center",
};

export const randomNumberStyle = {
  fontSize: { xs: "12px", sm: "16px", md: "20px" },
  color: "white",
  fontWeight: "900",
  fontFamily: "Georgia",
};

export const roomStyleAvatar = {
  width: { xs: "120px", sm: "120px", md: "200px" },
  height: { xs: "110px", sm: "140px", md: "200px" },
  borderRadius: "12px",
};

export const buttonStyle = {
  fontSize: { xs: "15px", sm: "18px" },
  textAlign: "center",
  position: "absolute",
};

export const roomStyleBack = {
  width: { xs: "180px", sm: "240px", md: "300px" },
  height: { xs: "240px", sm: "300px", md: "400px" },
};

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
  "&::-webkit-scrollbar": {
    width: "8px",
    backgroundColor: "#555",
  },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: "8px",
    backgroundColor: "#333",
  },
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
  borderRadius: "12px",
};
