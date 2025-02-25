import { Chip } from "@mui/material";
import { Priorities } from "../../models/card";
import { priorityMapper } from "../../utils/mappers";

type PriorityCellPropsType = {
  priority: Priorities;
};

const getChipStyle = (priority: Priorities) => {
  switch (priority) {
    case Priorities.Low:
      return "default";
    case Priorities.Medium:
      return "info";
    case Priorities.High:
      return "error";
    default:
      return "default";
  }
};

export const PriorityCell = ({ priority }: PriorityCellPropsType) => (
  <Chip
    style={{ width: "100%" }}
    component={"span"}
    color={getChipStyle(priority)}
    label={priorityMapper[priority] || "N/A"}
  />
);
