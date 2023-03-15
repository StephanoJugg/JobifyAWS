import React from "react";

type FormRowProps = {
  type: string;
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};

export default function FormRow({
  type,
  name,
  value,
  handleChange,
  label,
}: FormRowProps) {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {label || name}
      </label>

      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        className="form-input"
      />
    </div>
  );
}
