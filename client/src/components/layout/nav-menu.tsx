import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const menuOptions = [
  { id: "cards", path: "/", label: "Cards" },
  { id: "add", path: "/add", label: "Add Card" },
  { id: "practice", path: "/practice", label: "Practice" },
];

export const NavMenu = () => {
  const navigate = useNavigate();
  return (
    <List sx={{ p: 4 }}>
      {menuOptions.map(({ id, path, label }) => (
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
            onClick={() => navigate(path)}
          />
        </ListItem>
      ))}
    </List>
  );
};
