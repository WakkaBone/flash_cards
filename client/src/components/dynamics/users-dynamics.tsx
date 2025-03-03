import { Box } from "@mui/material";
import { useState } from "react";
import { GetUserDynamicsFilters } from "../../models/api";
import { useUsersDynamics } from "../../hooks";

export const UsersDynamics = () => {
  const [filters, setFilters] = useState<GetUserDynamicsFilters>({});
  const { data } = useUsersDynamics(filters);
  console.log(data);
  return (
    <Box>
      {/* TODO: filters */}
      {/* TODO: graph */}
    </Box>
  );
};
