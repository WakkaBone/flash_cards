import { MutateOptions } from "@tanstack/react-query";

export type MutateOptionsEnhanced<
  TData = any,
  TErrors = any,
  TVars = any,
  TContext = any
> = MutateOptions<TData, TErrors, TVars, TContext> & { hideToast?: boolean };
