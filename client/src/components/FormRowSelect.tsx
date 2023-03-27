import React from "react";

type FormRowSelectProps = {
  name: string;
  value: string;
  selectValues: string[];
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
};

export default function FormRowSelect({
  name,
  value,
  selectValues,
  handleChange,
  label,
}: FormRowSelectProps) {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {label || name}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="form-select"
      >
        {selectValues.map((itemValue, index) => {
          return (
            <option key={index} value={itemValue}>
              {itemValue}
            </option>
          );
        })}
      </select>
    </div>
  );
}
