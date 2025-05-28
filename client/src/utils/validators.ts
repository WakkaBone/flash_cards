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

const USERNAME_RULES = /^[A-Za-z0-9]+$/;
const PASSWORD_RULES =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~\-]{8,}$/;

export const usernameValidator = {
  pattern: {
    value: USERNAME_RULES,
    message: "Username cannot contain special characters",
  },
};

export const passwordValidator = {
  pattern: {
    value: PASSWORD_RULES,
    message:
      "Password must be at least 8 characters long, include at least one uppercase letter and one special character.",
  },
};
