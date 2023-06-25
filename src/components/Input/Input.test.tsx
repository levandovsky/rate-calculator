import { render } from "@testing-library/react";
import { vi, describe, it } from "vitest";
import userEvent from "@testing-library/user-event";
import Input from ".";
import { useEffect, useState } from "react";

const TestComponent = ({
  defaultValue,
  onChange,
  type,
}: {
  defaultValue: string | number;
  onChange: (val: string) => void;
  type: "text" | "number";
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    onChange(value as any);
  }, [value, onChange]);

  return (
    <Input
      type={type}
      value={value}
      onChange={setValue}
    />
  );
};

describe("Input", () => {
  it("renders input with passed value", () => {
    const { container } = render(<Input value="test" />);
    const input = container.querySelector("input") as HTMLInputElement;

    expect(input.value).toBe("test");
  });

  it("runs callback on change with text value", async () => {
    const callback = vi.fn();

    const { container } = render(
      <TestComponent type="text" onChange={callback} defaultValue={""} />
    );
    const input = container.querySelector("input") as HTMLInputElement;

    expect(input.value).toBe("");

    await userEvent.clear(input);
    await userEvent.type(input, "new value");

    expect(input.value).toBe("new value");
    expect(callback).toHaveBeenCalledWith("new value");
  });

  it("runs callback on change with number value", async () => {
    const callback = vi.fn();

    const { container } = render(
      <TestComponent type="number" onChange={callback} defaultValue={0} />
    );
    const input = container.querySelector("input") as HTMLInputElement;

    expect(input.value).toBe("0");

    await userEvent.clear(input);
    await userEvent.type(input, "123");

    expect(input.value).toBe("123");
    expect(callback).toHaveBeenCalledWith(123);
  });
});
