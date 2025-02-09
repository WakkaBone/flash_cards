export const addSeconds = (seconds: string | number) => {
  const secondsInt = typeof seconds === "string" ? parseInt(seconds) : seconds;
  return new Date(new Date().setSeconds(new Date().getSeconds() + secondsInt));
};
