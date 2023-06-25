import styles from "./styles.module.scss";
import { InputHTMLAttributes, ReactNode } from "react";

export type SelectProps<T extends string> = Omit<
  InputHTMLAttributes<HTMLSelectElement>,
  "value" | "onChange"
> & {
  options: T[];
  value?: T;
  formatOption?: (option: T) => string | ReactNode;
  onChange: (value: T) => void;
};

const Select = function <T extends string>({
  options,
  value,
  onChange,
  formatOption,
  ...nativeProps
}: SelectProps<T>) {
  return (
    <select
      value={value}
      className={styles.select}
      {...nativeProps}
      onChange={(e) => {
        const value = e.target.value;

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
