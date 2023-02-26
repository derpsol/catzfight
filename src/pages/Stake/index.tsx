import { Box, Typography } from "@mui/material";
import MeowToken from "./components/MeowToken";
import ChestInfo from "./components/ChestInfo";

const Stake = () => {
  return (
    <Box sx={{backgroundColor: "#989E90", py: {xs: 2, sm: 4, md: 6, xl: 8}	}}>
      <Typography 
				fontFamily="Audiowide"
				sx=
					{{ 
						color: '#F39B33', fontSize: { xs: "20px", sm: "28px", md: '36px', xl: '40'}, 
						py: 1, px: {xs: 1, sm: 3}, backgroundColor: "#393D32",						
						width: {xs: "320px", sm: '540px', md: '800px', xl: '1000px'},
						textAlign: 'center',
						mx: 'auto',	
            mb: 2                     									
					}}
			>
				War Chest Jackpot: 2,518 Tron
			</Typography>   
      <MeowToken />
      <ChestInfo />
    </Box>
  );
};

export default Stake;
