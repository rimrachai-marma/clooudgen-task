export const formatCurrency = (
  amount: number,
  currency: string,
  locale?: string
): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });

  return formatter.format(amount);
};
