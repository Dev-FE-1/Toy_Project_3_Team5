const DEFAULT_MAX_LENGTH = 50;

export const omittedText = (
  value: string,
  maxLength: number = DEFAULT_MAX_LENGTH
): string => {
  if (!!!value || value.trim().length < 1) return '';
  if (value.length > maxLength)
    return value.trim().substring(0, maxLength) + '...';

  return value;
};

export const tagging = (value: string) => {
  const trimValue = value.trim().split(' ').join('');
  if (trimValue.length > 0) {
    return trimValue.startsWith('#') ? trimValue : `#${trimValue}`;
  }
  return '';
};
