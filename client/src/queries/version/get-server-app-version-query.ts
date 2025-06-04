import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { VersionsService } from "../../services";
import { QUERY_KEYS } from "../../constants";

export const getServerAppVersionQuery = (): DefinedInitialDataOptions<
  ApiResponse<string>
> => ({
  initialData: { isSuccess: false },
  queryKey: [QUERY_KEYS.serverVersion],
  queryFn: async () => await VersionsService.getServerAppVersion(),
});
