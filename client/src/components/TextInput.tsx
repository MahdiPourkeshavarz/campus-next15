interface TextInputProps {
  id: string;
  label: string;
  name: string;
  type?: string;
  error?: string;
  defaultValue?: string;
}

export function TextInput({
  id,
  label,
  name,
  type = "text",
  error,
  defaultValue,
}: TextInputProps) {
  return (
    <div className="input__container">
      <label htmlFor={id} className="copy">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        className="input input__text input--beige"
        defaultValue={defaultValue}
      />
      {error && <p className="input__error">{error}</p>}
    </div>
  );
}
