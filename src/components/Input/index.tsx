import styles from "./styles.module.scss";
import { InputHTMLAttributes } from "react";

export type InputProps<T> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  value: T;
  onChange?: (value: T) => void;
};

const Input = function <T extends number | string>({
  name,
  value: passedValue,
  onChange,
  ...nativeProps
}: InputProps<T>) {
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (!onChange) return;

    if (nativeProps.type === "number") {
      onChange(Number(inputValue) as T);
      return;
    }

    onChange(inputValue as T);
  };

  return (
    <input
      className={styles.input}
      name={name}
      value={passedValue}
      {...nativeProps}
      onChange={changeHandler}
    />
  );
};

export default Input;
