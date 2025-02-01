import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth-context";

const menuOptions = [
  { id: "cards", path: "/", label: "Cards" },
  { id: "add", path: "/add", label: "Add Card" },
  { id: "practice", path: "/practice", label: "Practice" },
];

type MenuItemPropsType = {
  id: string;
  label: string;
  onClick: () => void;
};
const MenuItem = ({ id, label, onClick }: MenuItemPropsType) => (
  <ListItem key={id}>
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

export const NavMenu = () => {
  const navigate = useNavigate();
  const authContext = useAuthContext();
  if (!authContext) return null;

  return (
    <List sx={{ p: 4 }}>
      {menuOptions.map(({ id, path, label }) => (
        <MenuItem id={id} label={label} onClick={() => navigate(path)} />
      ))}
      <MenuItem
        id="logout"
        label="Logout"
        onClick={() => authContext.logout()}
      />
    </List>
  );
};
