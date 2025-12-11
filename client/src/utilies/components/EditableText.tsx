import { useEffect, useState } from "react";
import { BsCheck, BsX } from "react-icons/bs";
import "./Utilities.css";

export function EditableText({
  value,
  modifyValue,
  prefix = undefined,
}: {
  value: string;
  modifyValue: (newValue: string) => void;
  prefix?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const [formerValue, setFormerValue] = useState(value);

  // 🔄 Sync with external changes
  useEffect(() => {
    setNewValue(value);
    setFormerValue(value);
  }, [value]);

  const saveValue = () => {
    if (newValue.trim() === "") return;
    modifyValue(newValue);
    setFormerValue(newValue);
    setIsEditing(false);
  };

  const cancel = () => {
    setNewValue(formerValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    if (e.key === "Enter") {
      saveValue();
    } else if (e.key === "Escape") {
      cancel();
    }
  };

  return (
    <div className="editable-wrapper">
      {isEditing ? (
        <div className="editable-edit-container">
          {prefix && <span className="text-muted me-1">{prefix}</span>}
          <input
            className="editable-input"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button className="btn btn-success" onClick={saveValue}>
            <BsCheck />
          </button>
          <button className="btn btn-danger" onClick={cancel}>
            <BsX />
          </button>
        </div>
      ) : (
        <div className="editable-view" onClick={() => setIsEditing(true)}>
          {prefix && <span className="text-muted me-1">{prefix}</span>}
          <span>{value}</span>
        </div>
      )}
    </div>
  );
}
