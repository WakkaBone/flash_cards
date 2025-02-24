import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { VersionsService } from "../../services/version-service";

export const getServerAppVersionQuery = (): DefinedInitialDataOptions<
  ApiResponse<string>
> => ({
  initialData: { isSuccess: false },
  queryKey: ["server-app-version"],
  queryFn: async () => await VersionsService.getServerAppVersion(),
});
