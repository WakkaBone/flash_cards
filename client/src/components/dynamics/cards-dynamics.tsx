import { Box } from "@mui/material";
import { useState } from "react";
import { GetCardDynamicsFilters } from "../../models/api";
import { useCardsDynamics } from "../../hooks";

export const CardsDynamics = () => {
  const [filters, setFilters] = useState<GetCardDynamicsFilters>({});
  const { data } = useCardsDynamics(filters);
  console.log(data);
  return (
    <Box>
      {/* TODO: filters */}
      {/* TODO: graph */}
    </Box>
  );
};
