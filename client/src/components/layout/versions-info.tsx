import { CircularProgress, Typography } from "@mui/material";
import { useAppVersions } from "../../hooks";

export const VersionsInfo = () => {
  const { clientAppVersion, serverAppVersion, isLoading } = useAppVersions();
  if (isLoading) return <CircularProgress />;

  return (
    <Typography variant="caption">
      Client: v{clientAppVersion} | Server: v{serverAppVersion}
    </Typography>
  );
};
