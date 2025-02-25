import { Grid, Tooltip } from "@mui/material";
import { useStatistics } from "../../hooks/use-statistics";
import { Counter } from "./counter";
import { CenteredLoader } from "../loader/loader";
import { CollapsibleSection } from "../collapsible/collapsible-section";
import { BarChartRounded } from "@mui/icons-material";

export const StatisticsSection = () => {
  const { statisticsEntries, isFetched } = useStatistics();

  if (!isFetched) return <CenteredLoader />;
  if (!statisticsEntries) return null;

  return (
    <CollapsibleSection
      buttonText="Counters"
      buttonProps={{ startIcon: <BarChartRounded /> }}
    >
      <Grid container spacing={2}>
        {statisticsEntries.map((counter, index) => {
          const keysWithTranslation = ["lastAdded", "mostMistakes"];
          let value: string | JSX.Element = counter[1];
          if (keysWithTranslation.includes(counter[0])) {
            const splitValue = counter[1].split(" - ");
            value = (
              <Tooltip title={splitValue[1]}>
                <span>{splitValue[0]}</span>
              </Tooltip>
            );
          }
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Counter key={counter[0]} label={counter[2]} value={value} />
            </Grid>
          );
        })}
      </Grid>
    </CollapsibleSection>
  );
};
