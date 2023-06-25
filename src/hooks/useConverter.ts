import { useCallback } from "react";
import { Currency } from "../currencies";
import { useMergeState } from "./useMergeState";

export type ConverterParams = {
  from: Currency;
  to: Currency;
  amount: number;
};

export type ConverterData = {
  from: Currency;
  fromAmount: number;
  rate: number;
  to: Currency;
  toAmount: number;
};

type ConverterState = {
  converterData: ConverterData | null;
  isLoading: boolean;
  error: string | null;
};

export const useConverter = () => {
  const [state, setState] = useMergeState<ConverterState>({
    converterData: null,
    isLoading: false,
    error: null,
  });

  const calculateRates = useCallback(
    async ({ from, to, amount }: ConverterParams) => {
      const url = new URL(import.meta.env.VITE_CONVERTER_URL);
      url.searchParams.append("from", from);
      url.searchParams.append("to", to);
      url.searchParams.append("amount", amount.toString());

      setState({
        isLoading: true,
      });

      try {
        const response = await fetch(url);
        const converterData = (await response.json()) as ConverterData;

        setState({
          converterData,
          isLoading: false,
        });

        return converterData;
      } catch (e) {
        const error = e as Error;

        setState({
          error: error.message,
          isLoading: false,
        });

        return error;
      }
    },
    [setState]
  );

  return {
    ...state,
    calculateRates,
  };
};
