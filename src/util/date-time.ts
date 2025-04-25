export const toDateTimeLocal = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export const toUTCTime = (dateStr: string): string => {
  if (!dateStr) return dateStr;
  return new Date(dateStr).toISOString();
};
