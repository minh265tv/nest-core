export const getTimeStamp = (): number => {
  return Math.floor(new Date().getTime() / 1000);
};
