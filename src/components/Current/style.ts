export const fightStyle = {
  fontSize: { xs: "20px", sm: "24px", md: "28px" },
  fontFamily: "Georgia",
  fontWeight: "900",
  color: "white",
  lineHeight: { xs: "20px", sm: "24px", md: "36px" },
  textAlign: "center",
};

export const randomNumberStyle = {
  fontSize: { xs: "10px", sm: "12px", md: "14px" },
  color: "white",
  fontWeight: "900",
  fontFamily: "Georgia",
};

export const randomNumberPosStyle = {
  height: { xs: "20px", sm: "28px", md: "46px" },
}

export const buttonWidthStyle = {
  position: "relative",
  width: {xs: "80%", md: "80%"},
}

export const roomStyleAvatar = {
  width: { xs: "60px", sm: "70px", md: "100px" },
  height: { xs: "60px", sm: "70px", md: "100px" },
  borderRadius: "12px",
};

export const buttonStyle = {
  fontSize: { xs: "8px", sm: "12px", md: "14px" },
  textAlign: "center",
  position: "absolute",
};

export const roomContentTop = {
  top: { xs: '10px', md: '20px' }
}

export const roomStyleBack = {
  width: { xs: "90px", sm: "120px", md: "150px" },
  height: { xs: "130px", sm: "170px", md: "220px" },
};

export const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "400px", sm: "500px", md: "700px", lg: "1000px" },
  height: "600px",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  backgroundColor: "rgba(38,40,42)",
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

export const avatarsStyle = {
  display: "flex",
  justifyContent: "space-around",
  flexWrap: "wrap",
}

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
