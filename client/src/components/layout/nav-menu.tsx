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
  AccountCircleOutlined,
  AddCircleOutline,
  BackupTableOutlined,
  BarChartRounded,
  CategoryOutlined,
  GroupAddOutlined,
  Logout,
  StyleOutlined,
} from "@mui/icons-material";
import { Roles } from "../../models/user";

const iconStyles = { marginLeft: "5px", fontSize: ".9em" };
const menuOptions = [
  {
    id: "cards",
    path: "/",
    label: "Cards",
    icon: <BackupTableOutlined sx={iconStyles} />,
    roles: [Roles.admin, Roles.user],
  },
  {
    id: "add",
    path: ROUTES.addCard,
    label: "Add Card",
    icon: <AddCircleOutline sx={iconStyles} />,
    roles: [Roles.admin, Roles.user],
  },
  {
    id: "practice",
    path: ROUTES.practice,
    label: "Practice",
    icon: <StyleOutlined sx={iconStyles} />,
    roles: [Roles.admin, Roles.user],
  },
  {
    id: "categories",
    path: ROUTES.categories,
    label: "Categories",
    icon: <CategoryOutlined sx={iconStyles} />,
    roles: [Roles.admin, Roles.user],
  },
  {
    id: "statistics",
    path: ROUTES.statistics,
    label: "Statistics",
    icon: <BarChartRounded sx={iconStyles} />,
    roles: [Roles.admin, Roles.user],
  },
  {
    id: "users",
    path: ROUTES.users,
    label: "Users",
    icon: <GroupAddOutlined sx={iconStyles} />,
    roles: [Roles.admin],
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
  const { user, logout } = useAuthContext();
  const { pathname } = useLocation();

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    closeDrawer?.();
  };

  if (!user) return null;

  return (
    <List
      sx={{
        pt: 0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {menuOptions
        .filter(({ roles }) => (user ? roles.includes(user?.role) : false))
        .map(({ id, path, label, icon }) => (
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
      <ListItem style={{ flexGrow: 1 }} />
      <MenuItem
        id="my-account"
        key="my-account"
        label="My account"
        onClick={() => handleMenuItemClick(ROUTES.myAccount)}
        icon={<AccountCircleOutlined sx={iconStyles} />}
        isActive={pathname === ROUTES.myAccount}
        listItemStyle={{
          backgroundColor:
            pathname === ROUTES.myAccount ? "#1976d2" : "transparent",
        }}
      />
      <MenuItem
        id="logout"
        key="logout"
        label="Logout"
        onClick={logout}
        icon={<Logout sx={iconStyles} />}
        isActive={false}
      />
      <ListItem style={{ marginBottom: "10px" }} />
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
