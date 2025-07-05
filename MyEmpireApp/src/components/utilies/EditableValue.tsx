import { useState } from "react";
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
    <>
      {isEditing ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <InputGroup style={{ width: "8rem" }}>
            <Form.Control onChange={onChange} value={newValue} />
            <InputGroup.Text>{suffix}</InputGroup.Text>
          </InputGroup>
          <div>
            <Button
              variant="success"
              onClick={saveValue}
              style={{ padding: "0", marginRight: "0.5rem" }}
            >
              <BsCheckSquare style={{ margin: "0.4rem" }} />
            </Button>
            <Button variant="danger" onClick={cancel} style={{ padding: "0" }}>
              <BsXCircle style={{ margin: "0.4rem" }} />
            </Button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>
            {newValue}&nbsp;{suffix}
          </span>
          <Button
            onClick={() => setIsEditing(true)}
            variant="primary"
            style={{ padding: "0" }}
          >
            <BsPencil style={{ margin: "0.4rem" }} />
          </Button>
        </div>
      )}
    </>
  );
}
