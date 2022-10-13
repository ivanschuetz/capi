export const to = <
  T extends { readonly __tag: symbol; value: any } = {
    readonly __tag: unique symbol;
    value: never;
  }
>(
  value: T["value"]
): T => {
  return value as any as T;
};

export const from = <T extends { readonly __tag: symbol; value: any }>(
  value: T
): T["value"] => {
  return value as any as T["value"];
};
