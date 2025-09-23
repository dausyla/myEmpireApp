import { useEffect, useState } from "react";
import { Button, InputGroup, Form } from "react-bootstrap";
import { BsCheckSquare, BsPencil, BsXCircle } from "react-icons/bs";

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
  const [newValue, setNewValue] = useState(value);
  const [formerValue, setFormerValue] = useState(value);

  // 🔑 Sync local state when `value` changes from parent
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = Number(e.target.value);
    if (!isNaN(parsedValue)) {
      setNewValue(parsedValue);
      modifyValue(parsedValue);
    }
  };

  const saveValue = () => {
    setFormerValue(newValue);
    setIsEditing(false);
  };

  const cancel = () => {
    setIsEditing(false);
    setNewValue(formerValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isEditing) {
      if (e.key === "Enter") {
        setIsEditing(true);
      }
    } else {
      if (e.key === "Enter") {
        saveValue();
      } else if (e.key === "Escape") {
        cancel();
      }
    }
  };

  return (
    <InputGroup
      style={{
        width: "9rem",
      }}
      onKeyDown={handleKeyDown}
    >
      <Form.Control
        onChange={onChange}
        value={newValue}
        readOnly={!isEditing}
        onDoubleClick={() => setIsEditing(true)}
      />
      {isEditing ? (
        <>
          <Button
            variant="success"
            onClick={saveValue}
            style={{ padding: "0" }}
          >
            <BsCheckSquare style={{ margin: "0.4rem" }} />
          </Button>
          <Button variant="danger" onClick={cancel} style={{ padding: "0" }}>
            <BsXCircle style={{ margin: "0.4rem" }} />
          </Button>
        </>
      ) : (
        <>
          <InputGroup.Text>{suffix}</InputGroup.Text>
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline-primary"
            style={{ padding: "0" }}
          >
            <BsPencil style={{ margin: "0.4rem" }} />
          </Button>
        </>
      )}
    </InputGroup>
  );
}
