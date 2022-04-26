import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { signOut } from "providers/firebase";
import { useHomeNavigation } from "context/navigationContext";
import { pages } from "constants/constants";
import { Logout } from "@mui/icons-material";

const HeaderNav: React.FC = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [logoutDialog, setLogoutDialog] = React.useState<boolean>(false);

  const { handleNavigation, pathName, selectedPageIndex } = useHomeNavigation();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget);

  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleCloseUserMenu = (index?: number) => {
    setAnchorElUser(null);
    if (index !== undefined) {
      handleNavigate("/home/browse", 0);
    }
  };

  const handleNavigate = React.useCallback(
    (page, index) => {
      setAnchorElNav(null);
      handleNavigation(page, index);
    },
    [handleNavigation]
  );

  if (pathName === "/home/browse/store") return null;

  return (
    <AppBar position="static" color="secondary">
      <Dialog
        open={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        sx={{ p: 5 }}
      >
        <DialogContent sx={{ p: 5 }}>
          <DialogContentText>
            Are you sure you want to LOGOUT?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => signOut()}>Yes, log me out</Button>
          <Button variant="contained" onClick={() => setLogoutDialog(false)}>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => handleNavigate("/home", 0)}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              cursor: "pointer",
            }}
          >
            Food&nbsp;<span style={{ color: "#81c784" }}>Findr</span>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map(({ title, page }, index) => (
                <MenuItem
                  key={page}
                  onClick={() => handleNavigate(page, index)}
                  sx={{
                    backgroundColor:
                      selectedPageIndex === index
                        ? "rgba(255,255,255,0.15)"
                        : "",
                    "&:hover": {
                      backgroundColor:
                        selectedPageIndex === index
                          ? "rgba(255,255,255,0.15)"
                          : "",
                    },
                  }}
                >
                  <Typography textAlign="center">{title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => handleNavigate("/home", 0)}
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              cursor: "pointer",
            }}
          >
            Food&nbsp;<span style={{ color: "#81c784" }}>Findr</span>
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            {pages.map(({ title, page }, index) => (
              <Button
                key={page}
                onClick={() => handleNavigate(page, index)}
                sx={{
                  my: 0,
                  height: "69px",
                  color: "white",
                  display: "block",
                  borderRadius: "0px",
                  px: 1.5,
                  backgroundColor:
                    selectedPageIndex === index ? "rgba(255,255,255,0.15)" : "",
                  "&:hover": {
                    backgroundColor:
                      selectedPageIndex === index
                        ? "rgba(255,255,255,0.15)"
                        : "",
                  },
                }}
              >
                {title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={() => setLogoutDialog(true)} sx={{ p: 0 }}>
                <Logout
                  fontSize="small"
                  sx={{ color: "white", mr: { xs: 0, sm: 1 } }}
                />
                <Typography
                  sx={{ color: "white", display: { xs: "none", sm: "flex" } }}
                >
                  Logout
                </Typography>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default HeaderNav;
