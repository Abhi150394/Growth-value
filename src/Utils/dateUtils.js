export const formatToYMD = (isoDateString) => {
  if (!isoDateString) return "";
  try {
    return new Date(isoDateString).toISOString().split("T")[0];
  } catch (error) {
    console.error("Invalid date format:", isoDateString);
    return "";
  }
};
