import { Typography } from "@mui/material";
import { useAppVersions } from "../../hooks";

export const VersionsInfo = () => {
  const { clientAppVersion, serverAppVersion } = useAppVersions();

  return (
    clientAppVersion &&
    serverAppVersion && (
      <Typography variant="caption">
        Client: v{clientAppVersion} | Server: v{serverAppVersion}
      </Typography>
    )
  );
};
