import { useQuery } from "@tanstack/react-query";
import { VersionsService } from "../services/version-service";
import { getServerAppVersionQuery } from "../queries/version/get-server-app-version-query";

export const useAppVersions = () => {
  const clientAppVersion = VersionsService.getClientAppVersion();

  const { data, isLoading, isFetched } = useQuery(getServerAppVersionQuery());
  const serverAppVersion = data.data;

  return {
    clientAppVersion,
    serverAppVersion,
    isLoading: isLoading || !isFetched,
  };
};
