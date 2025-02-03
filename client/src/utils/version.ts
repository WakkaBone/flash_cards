export const getAppVersion = () => {
  const { version } = require("../../package.json");
  return version;
};
