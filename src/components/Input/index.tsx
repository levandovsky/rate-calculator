import "./styles.css";
import { InputHTMLAttributes } from "react";
import Field, { FieldProps } from "../Field";

export type InputProps<T> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  value: T;
  onChange?: (value: T) => void;
};

const Input = function <T extends number | string>({
  name,
  value,
  onChange,
  ...nativeProps
}: InputProps<T>) {
  const valueType = () => {
    if (value) return typeof value;

    return typeof value;
  };

  return (
    <input
      className="input"
      name={name}
      type={valueType()}
      value={value}
      {...nativeProps}
      onChange={(e) => {
        const value = e.target.value;

        if (!onChange) return;

        if (valueType() === "number") {
          return onChange(Number(value) as T);
        }

        onChange(value as T);
      }}
    />
  );
};

export const InputField = function <T extends number | string>({
  name,
  label,
  ...otherProps
}: InputProps<T> & Omit<FieldProps, "children">) {
  return (
    <Field name={name} label={label}>
      <Input name={name} {...otherProps} />
    </Field>
  );
};

export default Input;
