export const generateRandomId = (prefix = "_") => {};

export const pretreatEvents = (events) => {
  return events;
};

export const generateFormData = (object) => {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key]));
  return formData;
};
