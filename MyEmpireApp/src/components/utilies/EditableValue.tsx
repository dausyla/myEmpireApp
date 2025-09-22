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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <InputGroup style={{ width: "9rem" }}>
        <Form.Control
          onChange={onChange}
          value={newValue}
          disabled={!isEditing}
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
              variant="primary"
              style={{ padding: "0" }}
            >
              <BsPencil style={{ margin: "0.4rem" }} />
            </Button>
          </>
        )}
      </InputGroup>
    </div>
  );
}
