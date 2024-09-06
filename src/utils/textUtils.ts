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

export const convertUnitNumber = (value: number, fixed: number = 2): string => {
  let result = value.toString();

  const units = [
    { text: '억', divNum: 100000000 },
    { text: '만', divNum: 10000 },
    { text: '천', divNum: 1000 },
  ];

  units.some((unit) => {
    if (value > unit.divNum) {
      return (result =
        parseFloat(Number(value / unit.divNum).toFixed(fixed)) + unit.text);
    }
  });

  return result;
};
