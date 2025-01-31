import { List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const menuOptions = [
  { id: "cards", path: "/", label: "Cards" },
  { id: "add", path: "/add", label: "Add Card" },
  { id: "practice", path: "/practice", label: "Practice" },
];

export const NavMenu = () => {
  const navigate = useNavigate();
  return (
    <List>
      {menuOptions.map(({ id, path, label }) => (
        <ListItem key={id}>
          <ListItemText primary={label} onClick={() => navigate(path)} />
        </ListItem>
      ))}
    </List>
  );
};
