export const datePart = (isoDate) => {
  const date = new Date(isoDate);

  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${datePart}`;
};
