import { TealSource, TealSourceTemplate } from "./common/types";
import { from, to } from "./infra/newtype";

export const renderTemplate = (
  template: TealSourceTemplate,
  keyValues: Map<string, string>
): TealSource => {
  // TODO ensure that this utf-8 (doc doesn't say?)?
  let tealStr = new TextDecoder().decode(from(template));

  keyValues.forEach((value: string, key: string) => {
    tealStr = tealStr.replaceAll(key, value);
  });

  //   console.log("Rendered tealStr: " + tealStr);

  return to<TealSource>(new TextEncoder().encode(tealStr));
};
