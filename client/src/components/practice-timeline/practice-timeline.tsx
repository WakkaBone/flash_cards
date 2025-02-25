import { useState } from "react";
import { PracticeTimelineChart } from "./practice-timeline-chart";
import { PracticeTimelineFilters } from "./practice-timeline-filters";
import {
  getInitialPracticeTimelineFilters,
  GetPracticeTimelineFilters,
} from "../../hooks/use-practice-timeline-filters";
import { CollapsibleSection } from "../collapsible/collapsible-section";
import { TimelineOutlined } from "@mui/icons-material";

export const PracticeTimeline = () => {
  const [filters, setFilters] = useState<GetPracticeTimelineFilters>(
    getInitialPracticeTimelineFilters()
  );

  return (
    <CollapsibleSection
      buttonText="Practice Timeline"
      buttonProps={{ startIcon: <TimelineOutlined /> }}
    >
      <PracticeTimelineFilters filters={filters} onChange={setFilters} />
      <PracticeTimelineChart filters={filters} />
    </CollapsibleSection>
  );
};
