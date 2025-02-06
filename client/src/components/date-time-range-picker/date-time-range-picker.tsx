import { Stack } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useScreenSize } from "../../hooks";

const DATE_INPUT_FORMAT = "dd-MM-yyyy HH:mm";

type DateTimeRangePickerPropsType = {
  handleDateRangeChange: (type: "from" | "to", value: Date | null) => void;
  selectedRange: { from: Date | null; to: Date | null };
};

export const DateTimeRangePicker = ({
  handleDateRangeChange,
  selectedRange,
}: DateTimeRangePickerPropsType) => {
  const { isMobile } = useScreenSize();

  return (
    <Stack
      direction={"row"}
      sx={{ width: isMobile ? "100%" : "200%" }}
      spacing={1}
    >
      <DateTimePicker
        sx={{ width: "50%" }}
        label="From"
        ampm={false}
        maxDateTime={selectedRange.to || undefined}
        onAccept={(val) => handleDateRangeChange("from", val)}
        value={selectedRange.from}
        format={DATE_INPUT_FORMAT}
      />
      <DateTimePicker
        sx={{ width: "50%" }}
        label="To"
        ampm={false}
        minDateTime={selectedRange.from || undefined}
        maxDateTime={new Date()}
        onAccept={(val) => handleDateRangeChange("to", val)}
        value={selectedRange.to}
        format={DATE_INPUT_FORMAT}
      />
    </Stack>
  );
};
