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
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth-context";
import { ROUTES } from "../../constants";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useScreenSize } from "../../hooks";
import {
  AddCircleOutline,
  BackupTableOutlined,
  BarChartRounded,
  CategoryOutlined,
  Logout,
  StyleOutlined,
} from "@mui/icons-material";

const iconStyles = { marginLeft: "5px", fontSize: ".9em" };
const menuOptions = [
  {
    id: "cards",
    path: "/",
    label: "Cards",
    icon: <BackupTableOutlined sx={iconStyles} />,
  },
  {
    id: "add",
    path: ROUTES.addCard,
    label: "Add Card",
    icon: <AddCircleOutline sx={iconStyles} />,
  },
  {
    id: "practice",
    path: ROUTES.practice,
    label: "Practice",
    icon: <StyleOutlined sx={iconStyles} />,
  },
  {
    id: "categories",
    path: ROUTES.categories,
    label: "Categories",
    icon: <CategoryOutlined sx={iconStyles} />,
  },
  {
    id: "statistics",
    path: ROUTES.statistics,
    label: "Statistics",
    icon: <BarChartRounded sx={iconStyles} />,
  },
];

type MenuItemPropsType = {
  id: string;
  label: string;
  onClick: () => void;
  icon: JSX.Element;
  listItemStyle?: SxProps;
  isActive: boolean;
};
const MenuItem = ({
  id,
  label,
  onClick,
  icon,
  listItemStyle,
  isActive,
}: MenuItemPropsType) => (
  <ListItem key={id} sx={{ ...listItemStyle, p: "10px 40px" }}>
    <ListItemText
      sx={{ cursor: "pointer" }}
      primary={
        <Typography
          component="a"
          sx={{
            color: isActive ? "white" : "text.primary",
            cursor: "pointer",
          }}
        >
          {label} {icon}
        </Typography>
      }
      onClick={onClick}
    />
  </ListItem>
);

const MenuList = ({ closeDrawer }: { closeDrawer?: () => void }) => {
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const { pathname } = useLocation();

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    closeDrawer?.();
  };

  if (!authContext) return null;

  return (
    <List sx={{ pt: 0, height: "100%", overflow: "hidden" }}>
      {menuOptions.map(({ id, path, label, icon }) => (
        <MenuItem
          id={id}
          label={label}
          onClick={() => handleMenuItemClick(path)}
          icon={icon}
          isActive={pathname === path}
          listItemStyle={{
            backgroundColor: pathname === path ? "#1976d2" : "transparent",
          }}
        />
      ))}
      <MenuItem
        id="logout"
        label="Logout"
        onClick={() => authContext.logout()}
        icon={<Logout sx={iconStyles} />}
        listItemStyle={{
          position: "absolute",
          bottom: "0",
          marginBottom: "30px",
        }}
        isActive={false}
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
  const { burgerBreakpoint } = useScreenSize();
  if (burgerBreakpoint) return <BurgerMenu />;
  return <MenuList />;
};
