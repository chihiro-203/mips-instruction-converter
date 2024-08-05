// Remove unnecessary character and space from mips instruction
export const validateMIPS = (mips) => {
  const cleanedMIPS = mips
    .replace(/[^a-zA-Z0-9\s$]/g, "") // removes all characters except letters (a-z, A-Z), numbers (0-9), spaces, and dollar signs ($)
    .replace(/\s+/g, " ") // replaces multiple spaces with a single space
    .trim(); // removes leading and trailing spaces


    const words = cleanedMIPS.split(" ");

    if (words.length < 2 || words.length > 4) {
      return false;
    }

  //   return true;
  return cleanedMIPS;
};

const validKeywords = [
  "Hello World",
  "Search Engine Optimization",
  "This is a valid keyword",
  "One Two $ Three",
];

validKeywords.forEach((keyword) => {
  console.log(`${keyword}: ${validateMIPS(keyword)}`);
});

const invalidKeywords = [
  "Single Word",
  "Too Many Words!@#$%^&*()",
  "  Extra Spaces  ",
  "Invalid: ~`_-+={}|[]:;'<>?,./",
];

invalidKeywords.forEach((keyword) => {
  console.log(`${keyword}: ${validateMIPS(keyword)}`);
});
