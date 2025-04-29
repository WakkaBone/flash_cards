export const increasedLegendSpacingPlugin = {
  id: "increase-legend-spacing",
  beforeInit(chart: any) {
    const originalFit = chart.legend.fit;

    chart.legend.fit = function fit() {
      originalFit.bind(chart.legend)();
      this.height += 20;
    };
  },
};

export const sharedDatasetStyles = {
  fill: false,
  tension: 0.1,
  pointRadius: 5,
};

export const getSharedChartStyles = (
  isMobile: boolean
): React.CSSProperties => ({
  minHeight: isMobile ? "20vh" : "unset",
  marginTop: "2rem",
});
