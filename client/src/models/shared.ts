export type IdLabel = {
  id: string;
  label: string;
};

export enum AllOptionInt {
  All = 0,
}
export enum AllOptionString {
  All = "",
}

export type CounterByDate = Record<string, number>;

export type DateRange = {
  from?: Date;
  to?: Date;
};

export type Booleanified<T> = {
  [K in keyof T]: T[K] extends string
    ? boolean
    : T[K] extends object
    ? Booleanified<T[K]>
    : never;
};
