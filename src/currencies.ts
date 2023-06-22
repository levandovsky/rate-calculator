export const CURRENCIES = {
  UAH: "🇺🇦",
  EUR: "🇪🇺",
  PLN: "🇵🇱",
  GBP: "🇬🇧",
} as const;

export type Currency = keyof typeof CURRENCIES;
