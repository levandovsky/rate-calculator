import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import Field from ".";

describe("Field", () => {
  it("renders label and children", () => {
    const { container } = render(
      <Field name="test" label="test">
        <input name="test" />
      </Field>
    );

    expect(container).toHaveTextContent("test");
    expect(container.querySelector("input")).not.toBeNull();
  });

  it("renders label with name if label is not passed", () => {
    const { container } = render(
      <Field name="test">
        <input name="test" />
      </Field>
    );

    expect(container).toHaveTextContent("test");
    expect(container.querySelector("input")).not.toBeNull();
  });

  it("renders last error from array", () => {
    const { container } = render(
      <Field name="test" errors={["error", "error1"]}>
        <input name="test" />
      </Field>
    );

    expect(container).toHaveTextContent("error1");
  });
});
