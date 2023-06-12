import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Link,
  Box,
  Button,
  Menu,
  MenuItem,
  Container,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import DiscordIcon from "assets/images/discord-brands.svg";
import "./header.scss";

import Web3Status from "components/Web3Status";

const menuLists = [
  {
    link: "/play",
    text: "Play War",
  },
  {
    link: "/stake",
    text: "Meow Staking",
  },
  {
    link: "/result",
    text: "Result"
  },
  {
    link: "/admin",
    text: "Admin",
  }
];

const Header = () => {
  const history = useHistory();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickMenu = (link: string) => {
    handleCloseUserMenu();
    history.push(link);
  };

  return (
    <AppBar
      position="static"
      className="appbar"
      sx={{ backgroundColor: "rgba(9,9,10,1)" }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ justifyContent: "space-between", columnGap: "8px" }}
        >
          <Link href="/" className="logo" sx={{ textDecoration: "none" }}>
            {/* <Box component="img" src={LogoImage} alt="logo" /> */}
            <Typography
              fontFamily="Audiowide"
              sx={{ fontSize: { xs: "24px", sm: "36px", md: "40px" } }}
            >
              Catz Fight
            </Typography>
          </Link>
          <Box sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
            <Box
              className="social-buttons"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Button
                href="https://twitter.com/CryptoMoonCatz"
                target="_blank"
                rel="noreferrer"
                className="social-button"
                variant="contained"
                sx={{
                  backgroundColor: "transparent",
                  "&: hover": {
                    backgroundColor: "rgba(38,40,42,0.95)",
                  },
                }}
              >
                <TwitterIcon sx={{ color: "#fff" }} />
              </Button>
              <Button
                href="https://t.me/CryptoMoonCatz"
                target="_blank"
                rel="noreferrer"
                className="social-button"
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "transparent",
                  "&: hover": {
                    backgroundColor: "rgba(38,40,42,0.95)",
                  },
                }}
              >
                <TelegramIcon sx={{ color: "#fff" }} />
              </Button>
              <Button
                href="https://discord.gg/warchest"
                target="_blank"
                rel="noreferrer"
                className="social-button"
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "transparent",
                  "&: hover": {
                    backgroundColor: "rgba(38,40,42,0.95)",
                  },
                }}
              >
                <Box component="img" src={DiscordIcon} alt="" />
              </Button>
            </Box>
            <Web3Status />
            <Button
              onClick={handleOpenUserMenu}
              className="menu-button"
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "rgba(101,230,255,0.12)",
                "&: hover": {
                  backgroundColor: "rgba(101,230,255,0.15)",
                },
              }}
            >
              <MenuIcon
                sx={{
                  color: "rgba(101,230,255,0.9)",
                  "&: hover": {
                    color: "rgba(101,230,255,1)",
                  },
                }}
              />
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              sx={{
                mt: "45px",
              }}
            >
              <MenuItem
                component="a"
                href="https://www.cryptomooncatz.com"
                sx={{
                  backgroundColor: "rgba(101,230,255,0.12)",
                  color: "rgba(101,230,255,0.9)",
                }}
              >
                Home
              </MenuItem>
              {menuLists.map((list, key) => (
                <MenuItem
                  key={key}
                  sx={{
                    backgroundColor: "rgba(101,230,255,0.12)",
                    color: "rgba(101,230,255,0.9)",
                  }}
                  onClick={() => handleClickMenu(list.link)}
                >
                  {list.text}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
