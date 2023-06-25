import { it, describe, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { ConverterData } from "./hooks/useConverter";
import { createUrl } from "./utils/testUtils";

const converterData: ConverterData = {
  from: "EUR",
  to: "GBP",
  rate: 0.9,
  fromAmount: 1,
  toAmount: 0.9,
};

describe("App", () => {
  it("renders default fields and convert button", () => {
    const { container } = render(<App />);
    const fromField = container.querySelector(
      "select[name=from]"
    ) as HTMLSelectElement;
    const toField = container.querySelector(
      "select[name=to]"
    ) as HTMLSelectElement;
    const amountField = container.querySelector(
      "input[name=amount]"
    ) as HTMLInputElement;
    const convertButton = container.querySelector(
      "button[type=submit]"
    ) as HTMLButtonElement;

    expect(fromField).not.toBeNull();
    expect(toField).not.toBeNull();
    expect(amountField).not.toBeNull();
    expect(convertButton).not.toBeNull();

    expect(fromField.value).toBe("EUR");
    expect(toField.value).toBe("GBP");
    expect(amountField.value).toBe("1");
  });

  it("shows error when amount is invalid and doesn't invoke fetch", async () => {
    const { container } = render(<App />);
    const amountField = container.querySelector(
      "input[name=amount]"
    ) as HTMLInputElement;
    const convertButton = container.querySelector(
      "button[type=submit]"
    ) as HTMLButtonElement;

    vi.spyOn(window, "fetch");

    await userEvent.clear(amountField);

    expect(amountField.value).toBe("0");
    expect(container).toHaveTextContent("Amount should be greater than 0");

    await userEvent.click(convertButton);
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it("requests conversion on form submit and sets values", async () => {
    const { container } = render(<App />);
    const convertButton = container.querySelector(
      "button[type=submit]"
    ) as HTMLButtonElement;

    vi.spyOn(window, "fetch").mockResolvedValueOnce({
      json: () => new Promise((resolve) => resolve(converterData)),
    } as Response);

    const url = createUrl({
      amount: 1,
      from: "EUR",
      to: "GBP",
    });

    await userEvent.click(convertButton);

    expect(window.fetch).toHaveBeenCalled();
    expect(window.fetch).toHaveBeenLastCalledWith(url);

    expect(container.querySelector("button[type=submit]")).toBeNull();

    expect(container).toHaveTextContent("1 EUR = 0.9 GBP");
    expect(container).toHaveTextContent(
      "All figures are live mid-market rates"
    );

    const convertedField = container.querySelector(
      "input[name=converted]"
    ) as HTMLInputElement;

    expect(convertedField.value).toBe("0.9");
  });

  it("reverses conversion currencies on button click", async () => {
    const { container } = render(<App />);
    const reverseButton = container.querySelector(
      "button[type=button]" // reverse button
    ) as HTMLButtonElement;
    const fromField = container.querySelector(
      "select[name=from]"
    ) as HTMLSelectElement;
    const toField = container.querySelector(
      "select[name=to]"
    ) as HTMLSelectElement;

    expect(fromField.value).toBe("EUR");
    expect(toField.value).toBe("GBP");

    await userEvent.click(reverseButton);

    expect(fromField.value).toBe("GBP");
    expect(toField.value).toBe("EUR");

    const convertButton = container.querySelector(
      "button[type=submit]"
    ) as HTMLButtonElement;

    vi.spyOn(window, "fetch").mockResolvedValue({
      json: () => new Promise((resolve) => resolve(converterData)),
    } as Response);

    const url = createUrl({
      amount: 1,
      from: "GBP",
      to: "EUR",
    });

    await userEvent.click(convertButton);

    expect(window.fetch).toHaveBeenCalled();
    expect(window.fetch).toHaveBeenLastCalledWith(url);

    expect(container.querySelector("button[type=submit]")).toBeNull();

    await userEvent.click(reverseButton);

    expect(fromField.value).toBe("EUR");
    expect(toField.value).toBe("GBP");

    const convertedField = container.querySelector(
      "input[name=converted]"
    ) as HTMLInputElement;

    expect(container).toHaveTextContent("1 EUR = 0.9 GBP");
    expect(convertedField.value).toBe("0.9");
  });

  it("calls api and updates amount field when converted field is changed", async () => {
    const { container } = render(<App />);
    const convertButton = container.querySelector(
      "button[type=submit]"
    ) as HTMLButtonElement;

    vi.spyOn(window, "fetch").mockResolvedValue({
      json: () => new Promise((resolve) => resolve(converterData)),
    } as Response);

    await userEvent.click(convertButton);

    const convertedField = container.querySelector(
      "input[name=converted]"
    ) as HTMLInputElement;

    await userEvent.clear(convertedField);
    await userEvent.type(convertedField, "5");

    const url = createUrl({
      amount: 5,
      from: "GBP",
      to: "EUR",
    });

    await waitFor(() => expect(window.fetch).toHaveBeenLastCalledWith(url), {
      timeout: 500,
    });
  });

  it("shows error when fetch fails", async () => {
    const { container } = render(<App />);
    const convertButton = container.querySelector(
      "button[type=submit]"
    ) as HTMLButtonElement;

    vi.spyOn(window, "fetch").mockRejectedValueOnce(new Error("Fetch failed"));

    await userEvent.click(convertButton);

    expect(container).toHaveTextContent("Fetch failed");
  });

  it("doesn't allow to set same currencies", async () => {
    const { container } = render(<App />);
    const fromField = container.querySelector(
      "select[name=from]"
    ) as HTMLSelectElement;
    const toField = container.querySelector(
      "select[name=to]"
    ) as HTMLSelectElement;

    const getOptions = (field: HTMLSelectElement) => Array.from(field.querySelectorAll("option")).map(o => o.value);

    expect(getOptions(fromField)).not.toContain("GBP");
    expect(getOptions(toField)).not.toContain("EUR");

    await userEvent.selectOptions(fromField, "UAH");

    expect(getOptions(toField)).not.toContain("UAH");
  });
});
