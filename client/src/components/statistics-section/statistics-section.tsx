import {
  BarChartRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Collapse,
  Grid,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useStatistics } from "../../hooks/use-statistics";
import { Counter } from "./counter";
import { CenteredLoader } from "../loader/loader";

const StatsCard = styled(Card)({
  transition: "0.3s ease-in-out",
  marginBottom: "10px",
});

export const StatisticsSection = () => {
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen(!open);

  const { statisticsEntries, isFetched } = useStatistics();

  if (!isFetched) return <CenteredLoader />;
  if (!statisticsEntries) return null;

  return (
    <StatsCard>
      <CardContent>
        <Typography variant="h5">
          <Button
            variant="text"
            onClick={handleToggle}
            startIcon={<BarChartRounded />}
            endIcon={open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
          >
            Statistics
          </Button>
        </Typography>
        <Collapse in={open} timeout="auto" unmountOnExit>
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
        </Collapse>
      </CardContent>
    </StatsCard>
  );
};
