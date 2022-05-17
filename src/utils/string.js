const clearAndUpper = (text) => {
  return text.replace(/-/, "").toUpperCase();
};

export const toPascalCase = (text) => {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
};

export const toCamelCase = (text) => {
  return text.replace(/-\w/g, clearAndUpper);
};
