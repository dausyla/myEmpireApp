import { Button, Form, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { usePortfolio } from "../../contexts/PortfolioContext/PortfolioContextHook";
import { BsCheckSquare, BsPencil, BsXCircle, BsTrash } from "react-icons/bs";
import { useDateContext } from "../../contexts/DateContext/DateContextHook";

export function EditableDate({ index }: { index: number }) {
  const { portfolio } = usePortfolio();
  const { editDate, deleteDate } = useDateContext();

  const initialDate = portfolio
    ? new Date(portfolio.dates[index]).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0]; // Today

  const [newDate, setNewDate] = useState(initialDate);
  const [formerDate, setFormerDate] = useState(initialDate);
  const [isEditing, setIsEditing] = useState(false);

  const saveValue = () => {
    if (!newDate) return;
    const newDateTimestamp = new Date(newDate).getTime();
    const formerDateTimestamp = new Date(formerDate).getTime();

    if (newDateTimestamp !== formerDateTimestamp) {
      editDate(formerDateTimestamp, newDateTimestamp);
      setFormerDate(newDate);
    }
    setIsEditing(false);
    (document.activeElement as HTMLElement)?.blur();
  };

  const cancel = () => {
    setIsEditing(false);
    setNewDate(formerDate);
    (document.activeElement as HTMLElement)?.blur();
  };

  const remove = () => {
    const timestamp = new Date(formerDate).getTime();
    deleteDate(timestamp);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isEditing) {
      if (e.key === "Enter") setIsEditing(true);
    } else {
      if (e.key === "Enter") saveValue();
      else if (e.key === "Escape") cancel();
    }
  };

  useEffect(() => {
    setNewDate(initialDate);
    setFormerDate(initialDate);
  }, [initialDate]);

  return (
    <InputGroup style={{ minWidth: "10.5rem" }} onKeyDown={handleKeyDown}>
      <Form.Control
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
        readOnly={!isEditing}
        className="py-0 px-1"
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
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline-primary"
            className="py-0 px-1"
          >
            <BsPencil />
          </Button>
          <Button
            onClick={remove}
            variant="outline-danger"
            className="py-0 px-1"
          >
            <BsTrash />
          </Button>
        </>
      )}
    </InputGroup>
  );
}
