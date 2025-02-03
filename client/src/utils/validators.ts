const HEBREW_REGEX = /^[\u0590-\u05FF\s]+$/;
const ENGLISH_REGEX = /^[A-Za-z\s]+$/;

const isHebrew = (string: string) => HEBREW_REGEX.test(string);
const isEnglish = (string: string) => ENGLISH_REGEX.test(string);

export const hebrewValidator = {
  isHebrew: (value: string) => isHebrew(value) || "Text must be in Hebrew",
};
export const englishValidator = {
  isEnglish: (value: string) => isEnglish(value) || "Text must be in English",
};
