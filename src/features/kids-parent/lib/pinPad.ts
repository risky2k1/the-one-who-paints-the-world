export function appendPinDigit(current: string, digit: string, maxLength = 4): string {
  if (!/^\d$/.test(digit)) return current;
  if (current.length >= maxLength) return current;
  return current + digit;
}

export function backspacePin(current: string): string {
  return current.slice(0, -1);
}
