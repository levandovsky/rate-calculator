import { ConverterParams } from "../hooks/useConverter";

export const createUrl = (params: ConverterParams) => {
  const url = new URL(import.meta.env.VITE_CONVERTER_URL);

  url.searchParams.set("from", params.from);
  url.searchParams.set("to", params.to);
  url.searchParams.set("amount", String(params.amount));

  return url;
};