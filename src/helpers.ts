// Split and rearrange date string to date object
export const parseDate = (dateStr: string, splitter: string) => {
  const [day, month, year] = dateStr.split(splitter).map(Number);
  return new Date(year, month - 1, day);
};

// capitalize first letter of a word or sentence
export const capitalizeFirstLetter = (word: string) => {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};
