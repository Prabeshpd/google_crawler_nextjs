export const generateRandomString = (characterCount: number) => {
  return Math.random().toString(36).slice(-characterCount);
};
