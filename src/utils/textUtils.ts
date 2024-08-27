export const omittedText = (value: string, maxLength: number): string => {
  if (value.length > maxLength)
    return value.trim().substring(0, maxLength - 3) + '...';

  return value;
};
