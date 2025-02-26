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
