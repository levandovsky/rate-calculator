import "./styles.css";

export type FieldProps = {
  name: string;
  label: string;
  children: React.ReactNode;
};

const Field = ({ name, label, children }: FieldProps) => {
  return (
    <div className="field">
      <div className="label">
        <label htmlFor={name}>{label ? label : name}</label>
      </div>
      <div className="input-container">{children}</div>
    </div>
  );
};

export default Field;
