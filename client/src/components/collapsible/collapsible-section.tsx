import { ExpandLessRounded, ExpandMoreRounded } from "@mui/icons-material";
import {
  Button,
  ButtonProps,
  Card,
  CardContent,
  Collapse,
  styled,
  Typography,
} from "@mui/material";
import { PropsWithChildren, useState } from "react";

const AnimatedCard = styled(Card)({
  transition: "0.3s ease-in-out",
  marginBottom: "10px",
});

type CollapsibleSectionPropsType = PropsWithChildren<{
  buttonText: string;
  buttonProps?: ButtonProps;
}>;

export const CollapsibleSection = ({
  children,
  buttonText,
  buttonProps,
}: CollapsibleSectionPropsType) => {
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen(!open);

  return (
    <AnimatedCard>
      <CardContent>
        <Typography variant="h5">
          <Button
            variant="text"
            onClick={handleToggle}
            endIcon={open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
            {...buttonProps}
          >
            {buttonText}
          </Button>
        </Typography>
        <Collapse in={open} timeout="auto" unmountOnExit>
          {children}
        </Collapse>
      </CardContent>
    </AnimatedCard>
  );
};
