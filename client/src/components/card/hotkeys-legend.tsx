import { KeyboardAlt } from "@mui/icons-material";
import { Box, Stack, Tooltip, Typography } from "@mui/material";

type HotkeyItemPropsType = { keyCombo: string; description: string };
const HotkeyItem = ({ keyCombo, description }: HotkeyItemPropsType) => (
  <Typography>
    <Box component="span" fontWeight="bold">
      {keyCombo}
    </Box>
    {": "}
    {description}
  </Typography>
);

const HOTKEYS = [
  { keyCombo: "→", description: "Get next card" },
  { keyCombo: "Enter", description: "Submit answer" },
  { keyCombo: "E", description: "Edit card" },
  { keyCombo: "D", description: "Delete card" },
  { keyCombo: "L", description: "Mark card as learned" },
  {
    keyCombo: "F",
    description: "Reveal translation *",
    caption: "* Only in text input modes!",
  },
  {
    keyCombo: "1, 2, 3, 4",
    description: "Select option **",
    caption: "** Only in multi option modes!",
  },
];

export const HotkeysLegend = () => (
  <Stack sx={{ ml: "auto", p: 1 }}>
    <Tooltip
      title={
        <Box p={1}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Practice Hotkeys:
          </Typography>

          <Stack>
            {HOTKEYS.map(({ keyCombo, description }) => (
              <HotkeyItem
                key={keyCombo}
                keyCombo={keyCombo}
                description={description}
              />
            ))}
          </Stack>

          <Box mt={1}>
            {HOTKEYS.map(({ caption }) => (
              <Typography
                variant="caption"
                color="warning.main"
                display="block"
                key={caption}
              >
                {caption}
              </Typography>
            ))}
          </Box>
        </Box>
      }
    >
      <KeyboardAlt sx={{ fontSize: "1em", cursor: "pointer" }} />
    </Tooltip>
  </Stack>
);
