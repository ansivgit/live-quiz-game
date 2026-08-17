export const getResStringify = (reqType: string, data: unknown, id = 0): string => {
  return JSON.stringify({
    type: reqType,
    data: JSON.stringify(data),
    id,
  });
};