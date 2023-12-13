import { ChangeEvent } from 'react';

export function escapeSpecialRegExpChars(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);
export function parseInputChange(
  e: ChangeEvent<HTMLInputElement>,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
) {
  // Replace comma with dot
  let newValue = e.target.value.replace(/,/g, '.');
  if (newValue === '.') {
    newValue = '0.';
  }

  if (newValue === '' || inputRegex.test(escapeSpecialRegExpChars(newValue))) {
    e.target.value = newValue;
    onChange(e);
  }
}
