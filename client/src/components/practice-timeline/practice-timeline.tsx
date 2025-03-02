import { useState } from "react";
import { PracticeTimelineChart } from "./practice-timeline-chart";
import {
  FilterTypes,
  PracticeTimelineFilters,
} from "./practice-timeline-filters";
import { getInitialPracticeTimelineFilters } from "../../hooks/practice-timeline/use-practice-timeline-filters";
import { CollapsibleSection } from "../collapsible/collapsible-section";
import { TimelineOutlined } from "@mui/icons-material";
import { GetPracticeTimelineFilters } from "../../models/api";

export const PracticeTimeline = () => {
  const [filters, setFilters] = useState<GetPracticeTimelineFilters>(
    getInitialPracticeTimelineFilters()
  );

  return (
    <CollapsibleSection
      buttonText="Practice Timeline"
      buttonProps={{ startIcon: <TimelineOutlined /> }}
    >
      <PracticeTimelineFilters
        filters={filters}
        onChange={setFilters}
        enabledFilters={[FilterTypes.DateRange]}
      />
      <PracticeTimelineChart filters={filters} />
    </CollapsibleSection>
  );
};
