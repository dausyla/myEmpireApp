import { useState } from "react";
import { BsCheck, BsX, BsTrash } from "react-icons/bs";
import { useBatch } from "../../contexts/BatchContext/BatchContextHook";
import "./Utilities.css";

export function EditableDate({
  dateId,
  currentDate,
}: {
  dateId: number;
  currentDate: string;
}) {
  const { updateDate, deleteDate } = useBatch();
  const [newDate, setNewDate] = useState(currentDate);
  const [isEditing, setIsEditing] = useState(false);

  const saveValue = () => {
    if (!newDate || newDate === currentDate) {
      setIsEditing(false);
      return;
    }
    updateDate(dateId, { date: newDate });
    setIsEditing(false);
  };

  const cancel = () => {
    setIsEditing(false);
    setNewDate(currentDate);
  };

  const remove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this date?")) {
      deleteDate(dateId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") saveValue();
    else if (e.key === "Escape") cancel();
  };

  return (
    <div className="editable-wrapper">
      {isEditing ? (
        <div className="editable-edit-container">
          <input
            type="date"
            className="editable-input"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
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
          <span className="fw-medium">{currentDate.replace(/-/g, "/")}</span>
          <button
            className="btn btn-danger ms-2"
            onClick={remove}
            title="Delete Date"
          >
            <BsTrash style={{ fontSize: "0.8em" }} />
          </button>
        </div>
      )}
    </div>
  );
}
