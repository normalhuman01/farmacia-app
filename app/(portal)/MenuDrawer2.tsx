"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { AccountCircle } from "@mui/icons-material";
import ArrowRight from "@mui/icons-material/ArrowRight";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, Collapse, Link, Menu, MenuItem } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import NextLink from "next/link";
import { redirect, useRouter } from "next/navigation";
import * as React from "react";
import Loading from "../(components)/Loading";

const appName = "Atención farmacéutica";

const drawerWidth = 240;

export default function MenuDrawer2({ children }: React.PropsWithChildren<{}>) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { logout } = useAuth0();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfile = () => {
    router.push("/profile");
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    setAnchorEl(null);
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));

  const [pillOpen, setPillOpen] = React.useState(true);

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return redirect("/");

  const drawer = (
    <List>
      <Link
        component={NextLink}
        href="/patients"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <span className="material-symbols-outlined">patient_list</span>
            </ListItemIcon>
            <ListItemText primary="Pacientes" />
          </ListItemButton>
        </ListItem>
      </Link>
      <ListItem>
        <ListItemButton onClick={() => setPillOpen((prev) => !prev)}>
          <ListItemIcon>
            <span className="material-symbols-outlined">pill</span>
          </ListItemIcon>
          <ListItemText primary="Medicamentos" />
          {/* {pillOpen ? <ExpandLess /> : <ExpandMore />} */}
        </ListItemButton>
      </ListItem>
      <ListItem>
        <Collapse in={pillOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link
              component={NextLink}
              href="/drugs/narrow-margin"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <ArrowRight />
                </ListItemIcon>
                <ListItemText primary="Estrecho margen" />
              </ListItemButton>
            </Link>
            <Link
              component={NextLink}
              href="/drugs/dci"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <ArrowRight />
                </ListItemIcon>
                <ListItemText primary="DCI" />
              </ListItemButton>
            </Link>
            <Link
              component={NextLink}
              href="/drugs/pharmaceutical-product"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <ArrowRight />
                </ListItemIcon>
                <ListItemText primary="Productos farmacéuticos" />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>
      </ListItem>
      <Link
        component={NextLink}
        href="/cie10"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <span className="material-symbols-outlined">prescriptions</span>
            </ListItemIcon>
            <ListItemText primary="CIE10" />
          </ListItemButton>
        </ListItem>
      </Link>
    </List>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography variant="h6" noWrap component="div">
              {appName}
            </Typography>
            <Button
              variant="text"
              color="inherit"
              startIcon={<AccountCircle />}
              onClick={handleClick}
            >
              {user?.nickname}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {/* <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                Perfil
              </MenuItem> */}
              <MenuItem onClick={handleLogOut}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                Cerrar sesión
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <DrawerHeader />
          <Divider />
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
