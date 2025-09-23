import { Button, Form, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { usePortfolio } from "../../contexts/PortfolioContext/PortfolioContextHook";
import { BsCheckSquare, BsPencil, BsXCircle, BsTrash } from "react-icons/bs";

export function EditableDate({ index }: { index: number }) {
  const { portfolio, editDate, deleteDate } = usePortfolio();

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

    editDate(formerDateTimestamp, newDateTimestamp);

    setFormerDate(newDate);
    setIsEditing(false);
  };

  const cancel = () => {
    setIsEditing(false);
    setNewDate(formerDate);
  };

  const remove = () => {
    const timestamp = new Date(formerDate).getTime();
    deleteDate(timestamp);
  };

  useEffect(() => {
    setNewDate(initialDate);
    setFormerDate(initialDate);
  }, [initialDate]);

  return (
    <InputGroup style={{ display: "flex", width: "12rem" }}>
      <Form.Control
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
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
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline-primary"
            style={{ padding: "0" }}
          >
            <BsPencil style={{ margin: "0.4rem" }} />
          </Button>
          <Button
            onClick={remove}
            variant="outline-danger"
            style={{ padding: "0" }}
          >
            <BsTrash style={{ margin: "0.4rem" }} />
          </Button>
        </>
      )}
    </InputGroup>
  );
}
