import { useQuery } from "@tanstack/react-query";
import { VersionsService } from "../services/version-service";
import { getServerAppVersionQuery } from "../queries/cards/get-server-app-version-query";

export const useAppVersions = () => {
  const clientAppVersion = VersionsService.getClientAppVersion();

  const { data, isLoading } = useQuery(getServerAppVersionQuery());
  const serverAppVersion = data.data;

  return { clientAppVersion, serverAppVersion, isLoading };
};
