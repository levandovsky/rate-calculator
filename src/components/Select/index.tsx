import styles from "./styles.module.scss";
import { InputHTMLAttributes, ReactNode } from "react";

export type SelectProps<T> = Omit<
  InputHTMLAttributes<HTMLSelectElement>,
  "value" | "onChange"
> & {
  options: T[];
  value?: T;
  formatOption?: (option: T) => string | ReactNode;
  onChange: (value: T) => void;
};

const Select = function <T extends number | string>({
  options,
  value,
  onChange,
  formatOption,
  ...nativeProps
}: SelectProps<T>) {
  const valueType = () => {
    if (value) return typeof value;

    return typeof options[0];
  };

  return (
    <select
      value={value === undefined ? "" : value}
      className={styles.select}
      {...nativeProps}
      onChange={(e) => {
        const value = e.target.value;

        if (valueType() === "number") {
          return onChange(Number(value) as T);
        }

        onChange(value as T);
      }}
    >
      {options.map((option) => {
        return (
          <option value={option} key={option}>
            {formatOption ? formatOption(option) : option}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
