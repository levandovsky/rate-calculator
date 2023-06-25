import { vi, describe, it } from "vitest";
import userEvent from "@testing-library/user-event";
import Select from ".";
import { render } from "@testing-library/react";
import { useEffect, useState } from "react";

const TestComponent = ({
  onChange,
  formatOption,
  options,
  defaultValue,
}: {
  onChange?: (val: string) => void;
  formatOption?: (val: string) => string;
  options: string[];
  defaultValue: string;
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (onChange) onChange(value);
  }, [value, onChange]);

  return (
    <Select
      value={value}
      onChange={setValue}
      options={options}
      formatOption={formatOption}
    />
  );
};

describe("Select", () => {
  it("renders select with passed value", () => {
    const { container } = render(
      <TestComponent options={["test"]} defaultValue="test" />
    );
    const select = container.querySelector("select") as HTMLSelectElement;

    expect(select.value).toBe("test");
  });

  it("runs callback on change", async () => {
    const callback = vi.fn();

    const { container } = render(
      <TestComponent
        options={["test", "test2"]}
        onChange={callback}
        defaultValue="test"
      />
    );
    const select = container.querySelector("select") as HTMLSelectElement;

    expect(select.value).toBe("test");

    await userEvent.selectOptions(select, "test2");

    expect(select.value).toBe("test2");
    expect(callback).toHaveBeenCalledWith("test2");
  });

  it("renders options with formatOption", () => {
    const { container } = render(
      <TestComponent
        options={["test", "test2"]}
        defaultValue="test"
        formatOption={(val) => `Formatted ${val}`}
      />
    );
    const select = container.querySelector("select") as HTMLSelectElement;

    expect(select.value).toBe("test");
    expect(select).toHaveTextContent("Formatted test");
    expect(select).toHaveTextContent("Formatted test2");
  });
});
