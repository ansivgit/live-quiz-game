import { randomInt } from 'node:crypto';

export const getResStringify = (reqType: string, data: unknown, id = 0): string => {
  return JSON.stringify({
    type: reqType,
    data,
    id,
  });
};

export const generateCode = (length = 6): string => {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  if (!Number.isInteger(length) || length <= 0) {
    throw new TypeError('Code length must be a positive integer');
  }
  
  for (let i = 0; i < length; i += 1) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  
  return code;
};