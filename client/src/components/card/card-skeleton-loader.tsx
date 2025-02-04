import { Skeleton } from "@mui/material";
import { useScreenSize } from "../../hooks";

export const CardSkeletonLoader = () => {
  const { isMobile } = useScreenSize();
  return (
    <>
      <Skeleton
        variant="text"
        width={isMobile ? "40%" : "20%"}
        height="1rem"
        sx={{ marginBottom: "0.35em" }}
      />
      <Skeleton variant="text" width={isMobile ? "50%" : "25%"} height="2rem" />
      <Skeleton
        variant="text"
        width={isMobile ? "40%" : "20%"}
        sx={{ marginBottom: 1.5 }}
        height={20}
      />
      <Skeleton variant="text" width={isMobile ? "50%" : "25%"} height="5rem" />
      <Skeleton variant="text" width={isMobile ? "40%" : "20%"} height={20} />
    </>
  );
};
