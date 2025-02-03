import { Card, CardContent, Typography } from "@mui/material";
import { useScreenSize } from "../../hooks";

export const Counter = ({
  label,
  value,
}: {
  label: string;
  value: string | JSX.Element;
}) => {
  const { isMobile } = useScreenSize();
  return (
    <Card
      style={{
        marginTop: isMobile ? "5px" : "10px",
        padding: isMobile ? "5px" : "10px",
        height: "100%",
      }}
    >
      <CardContent>
        <Typography
          display={"inline"}
          fontSize={isMobile ? "0.8rem" : "1rem"}
          variant={isMobile ? "body2" : "h6"}
          style={{ color: "#555" }}
        >
          {label}:{" "}
        </Typography>
        <Typography
          display={"inline"}
          fontSize={isMobile ? "0.8rem" : "1rem"}
          variant={isMobile ? "body2" : "h6"}
          style={{ fontWeight: "bold", color: "#1976d2" }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};
