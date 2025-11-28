import { useEffect, useState } from "react";
import { BsCheck, BsX } from "react-icons/bs";
import "./Utilities.css";

export function EditableValue({
  value,
  modifyValue,
  suffix = "$",
}: {
  value: number;
  modifyValue: (newValue: number) => void;
  suffix?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState<string>(value.toString());
  const [formerValue, setFormerValue] = useState<string>(value.toString());

  useEffect(() => {
    setNewValue(value.toString());
  }, [value]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(e.target.value); // keep raw string
  };

  const saveValue = () => {
    const parsed = Number(newValue);
    if (!isNaN(parsed)) {
      modifyValue(parsed);
      setFormerValue(newValue);
    } else {
      setNewValue(formerValue); // rollback if invalid
    }
    setIsEditing(false);
    (document.activeElement as HTMLElement)?.blur();
  };

  const cancel = () => {
    setIsEditing(false);
    setNewValue(formerValue);
    (document.activeElement as HTMLElement)?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isEditing) {
      if (e.key === "Enter") setIsEditing(true);
    } else {
      if (e.key === "Enter") saveValue();
      else if (e.key === "Escape") cancel();
    }
  };

  return (
    <div className="editable-wrapper">
      {isEditing ? (
        <div className="editable-edit-container">
          <input
            className="editable-input"
            value={newValue}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button className="utility-btn success" onClick={saveValue}>
            <BsCheck />
          </button>
          <button className="utility-btn danger" onClick={cancel}>
            <BsX />
          </button>
        </div>
      ) : (
        <div className="editable-view" onClick={() => setIsEditing(true)}>
          <span>
            {suffix}
            {value.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
