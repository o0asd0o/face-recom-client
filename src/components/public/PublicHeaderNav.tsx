import { AppBar, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { GridMenuIcon } from "@mui/x-data-grid";
import { landingPages } from "constants/constants";
import { usePublicNavigation } from "context/publicNavigationContext";
import React from "react";

const PublicHeaderNav: React.FC = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const { handleNavigation, selectedPageIndex } = usePublicNavigation();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleNavigate = React.useCallback((page, index) => {
      setAnchorElNav(null);
      handleNavigation(page, index);
    }, [handleNavigation])

    return <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => handleNavigate("/", 3)}
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, cursor: "pointer"}}
          >
             Food&nbsp;<span style={{ color: "#81c784" }}>Findr</span>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <GridMenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'flex', md: 'none' },
              }}
            >
              {landingPages.map(({ page, title }, index) => (
                <MenuItem key={page} onClick={() => handleNavigate(page, index)}  sx={{
                  backgroundColor: selectedPageIndex === index ? "rgba(255,255,255,0.15)" : "",
                    '&:hover': {
                      backgroundColor: selectedPageIndex === index ? "rgba(255,255,255,0.15)" : ""
                    }
                }}>
                  <Typography textAlign="center">{title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => handleNavigate("/", 3)}
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            Food&nbsp;<span style={{ color: "#81c784" }}>Findr</span>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, flexDirection: "row-reverse" }}>
            {landingPages.map(({ page, title }, index) => (
              <Button
                key={page}
                onClick={() => handleNavigate(page, index)}
                sx={{
                  my: 0,
                  mx: 1,
                  color: 'white',
                  display: 'block',
                  height: "64px",
                  backgroundColor: selectedPageIndex === index ? "rgba(255,255,255,0.15)" : "",
                    '&:hover': {
                      backgroundColor: selectedPageIndex === index ? "rgba(255,255,255,0.15)" : ""
                    }
                }}
              >
                {title}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
}

export default PublicHeaderNav;