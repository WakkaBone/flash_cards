import { NIQQUD_REGEXP } from "../constants";

const removeNiqqud = (text: string) => text.replace(NIQQUD_REGEXP, "");

export const compareWithoutNiqqud = (a: string, b: string) =>
  removeNiqqud(a) === removeNiqqud(b);
