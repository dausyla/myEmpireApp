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
    <InputGroup
      style={{
        minWidth: "7rem",
      }}
      onKeyDown={handleKeyDown}
    >
      <Form.Control
        onChange={onChange}
        value={newValue}
        onClick={() => setIsEditing(true)}
        className="text-end py-0 px-1"
      />
      {isEditing ? (
        <>
          <Button variant="success" onClick={saveValue} className="py-0 px-1">
            <BsCheckSquare />
          </Button>
          <Button variant="danger" onClick={cancel} className="py-0 px-1">
            <BsXCircle />
          </Button>
        </>
      ) : (
        <>
          <InputGroup.Text className="py-0 px-1">{suffix}</InputGroup.Text>
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline-primary"
            className="py-0 px-1"
          >
            <BsPencil />
          </Button>
        </>
      )}
    </InputGroup>
  );
}
