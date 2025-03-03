import { Box } from "@mui/material";
import { CardsDynamics } from "./cards-dynamics";
import { UsersDynamics } from "./users-dynamics";
import { CollapsibleSection } from "../collapsible/collapsible-section";
import { AutoGraph } from "@mui/icons-material";

export const Dynamics = () => (
  <Box>
    <CollapsibleSection
      buttonText="Cards Dynamics"
      buttonProps={{ startIcon: <AutoGraph /> }}
    >
      <CardsDynamics />
    </CollapsibleSection>
    <CollapsibleSection
      buttonText="Users Dynamics"
      buttonProps={{ startIcon: <AutoGraph /> }}
    >
      <UsersDynamics />
    </CollapsibleSection>
  </Box>
);
