import { useEffect, useState } from "react";
import { Button, InputGroup, Form } from "react-bootstrap";
import { BsCheckSquare, BsPencil, BsXCircle } from "react-icons/bs";

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
    <InputGroup style={{ width: "12rem" }} onKeyDown={handleKeyDown}>
      {prefix && <InputGroup.Text>{prefix}</InputGroup.Text>}
      <Form.Control
        value={newValue}
        readOnly={!isEditing}
        onChange={(e) => setNewValue(e.target.value)}
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
        <Button
          onClick={() => setIsEditing(true)}
          variant="outline-primary"
          style={{ padding: "0" }}
        >
          <BsPencil style={{ margin: "0.4rem" }} />
        </Button>
      )}
    </InputGroup>
  );
}
