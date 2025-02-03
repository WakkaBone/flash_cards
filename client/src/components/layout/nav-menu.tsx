import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  SxProps,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth-context";
import { ROUTES } from "../../constants";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useScreenSize } from "../../hooks";

const menuOptions = [
  { id: "cards", path: "/", label: "Cards" },
  { id: "add", path: ROUTES.addCard, label: "Add Card" },
  { id: "practice", path: ROUTES.practice, label: "Practice" },
];

type MenuItemPropsType = {
  id: string;
  label: string;
  onClick: () => void;
  listItemStyle?: SxProps;
};
const MenuItem = ({ id, label, onClick, listItemStyle }: MenuItemPropsType) => (
  <ListItem key={id} sx={{ ...listItemStyle }}>
    <ListItemText
      sx={{ cursor: "pointer" }}
      primary={
        <Typography
          component="a"
          sx={{
            color: "primary.main",
            cursor: "pointer",
          }}
        >
          {label}
        </Typography>
      }
      onClick={onClick}
    />
  </ListItem>
);

const MenuList = ({ closeDrawer }: { closeDrawer?: () => void }) => {
  const navigate = useNavigate();
  const authContext = useAuthContext();

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    closeDrawer?.();
  };

  if (!authContext) return null;

  return (
    <List sx={{ p: 4, height: "100%", overflow: "hidden" }}>
      {menuOptions.map(({ id, path, label }) => (
        <MenuItem
          id={id}
          label={label}
          onClick={() => handleMenuItemClick(path)}
        />
      ))}
      <MenuItem
        id="logout"
        label="Logout"
        onClick={() => authContext.logout()}
        listItemStyle={{
          position: "absolute",
          bottom: "0",
          marginBottom: "30px",
        }}
      />
    </List>
  );
};

const BurgerMenu = () => {
  const [open, setOpen] = useState(false);
  const handleToggleDrawer = () => setOpen(!open);

  return (
    <>
      <Box m={2}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleToggleDrawer}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Drawer anchor="left" open={open} onClose={handleToggleDrawer}>
        <MenuList closeDrawer={handleToggleDrawer} />
      </Drawer>
    </>
  );
};

export const NavMenu = () => {
  const { isMobile, isTablet } = useScreenSize();
  if (isMobile || isTablet) return <BurgerMenu />;
  return <MenuList />;
};
