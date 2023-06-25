import { classnames } from "../../utils/classnames";
import styles from "./styles.module.scss";

export type FieldProps = {
  name: string;
  label?: string;
  errors?: string[];
  children: React.ReactNode;
};

const Field = ({ name, label, errors = [], children }: FieldProps) => {
  const lastError = errors[errors.length - 1];

  return (
    <div className={styles.field}>
      <div className={styles.label}>
        <label htmlFor={name}>{label ? label : name}</label>
      </div>
      <div
        className={classnames(styles.inputContainer, {
          [styles.invalid]: errors.length > 0,
        })}
      >
        {children}
      </div>
      {errors.length > 0 && <div className={styles.error}>{lastError}</div>}
    </div>
  );
};

export default Field;
