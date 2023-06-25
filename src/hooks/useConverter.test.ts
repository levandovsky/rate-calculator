import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ConverterData, ConverterParams, useConverter } from "./useConverter";
import { act } from "react-dom/test-utils";
import { createUrl } from "../utils/testUtils";

const mockConverterData: ConverterData = {
  from: "GBP",
  to: "EUR",
  rate: 0.9,
  fromAmount: 1,
  toAmount: 0.9,
};

describe("converter", () => {
  it("inits with empty state", () => {
    const { result } = renderHook(() => useConverter());

    expect(result.current).toEqual({
      calculateRates: expect.any(Function),
      converterData: null,
      isLoading: false,
      error: null,
    });
  });

  it("sets loading state", () => {
    const { result } = renderHook(() => useConverter());

    act(() => {
      result.current.calculateRates({
        from: "GBP",
        to: "EUR",
        amount: 100,
      });
    });

    expect(result.current).toEqual({
      calculateRates: expect.any(Function),
      converterData: null,
      isLoading: true,
      error: null,
    });
  })

  it("calculates rates", async () => {
    const { result } = renderHook(() => useConverter());

    vi.spyOn(window, "fetch").mockResolvedValueOnce({
      json: () => Promise.resolve(mockConverterData),
    } as Response);

    const params: ConverterParams = {
      from: "GBP",
      to: "EUR",
      amount: 100,
    };

    const url = createUrl(params);

    await act(async () => {
      result.current.calculateRates(params);
    });

    expect(result.current).toEqual({
      calculateRates: expect.any(Function),
      converterData: mockConverterData,
      isLoading: false,
      error: null,
    });

    expect(window.fetch).toHaveBeenCalledWith(url);
  });

  it("sets error if fetch fails", async () => {
    const { result } = renderHook(() => useConverter());

    vi.spyOn(window, "fetch").mockRejectedValueOnce(new Error("Network error"));

    const params: ConverterParams = {
      from: "GBP",
      to: "EUR",
      amount: 100,
    };

    await act(async () => {
      result.current.calculateRates(params);
    });

    expect(result.current).toEqual({
      calculateRates: expect.any(Function),
      converterData: null,
      isLoading: false,
      error: "Network error",
    });
  });
});
