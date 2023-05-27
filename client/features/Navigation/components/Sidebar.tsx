import React from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { Divider } from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AddIcon from "@mui/icons-material/Add";
import CollectionsIcon from "@mui/icons-material/Collections";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const menuItems = [
  {
    text: "Browse",
    icon: <TravelExploreIcon />,
    route: "/pokemons/browse",
    requireAuth: false,
  },
  {
    text: "My Pokedex",
    icon: <CollectionsIcon />,
    route: "/pokemons/my-pokedex",
    requiresAuth: true,
  },
  {
    text: "Add Pokemon",
    icon: <AddIcon />,
    route: "/pokemons/add-pokemon",
    requiresAuth: true,
  },
];

const Sidebar: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userSignOut = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL+ "/api/auth/logout", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + session?.user?.accessToken,
        },
      });
      console.log("res", res);
    } catch (error) {
      console.log(error);
    }

    signOut();
  };

  const drawerWidth = 240;
  return (
    <>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {menuItems.map(
            (item) =>
              (!item.requiresAuth ||
                (item.requiresAuth &&
                  session &&
                  status === "authenticated")) && (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton onClick={() => router.push(item.route)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              )
          )}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        <List>
          {session && status === "authenticated" ? (
            <ListItemButton onClick={userSignOut}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          ) : (
            <ListItemButton onClick={() => signIn()}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
