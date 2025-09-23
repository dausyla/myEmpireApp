import { Button, Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { usePortfolio } from "../../contexts/PortfolioContext/PortfolioContextHook";
import { BsPlus } from "react-icons/bs";

export function AddDateButton() {
  const { addDate } = usePortfolio();

  const [newDate, setNewDate] = useState("");

  const addDateButton = () => {
    if (!newDate) return;

    const newDateTimestamp = new Date(newDate).getTime();

    addDate(newDateTimestamp);

    setNewDate("");
  };

  return (
    <InputGroup style={{ display: "flex", minWidth: "10.5rem" }}>
      <Form.Control
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
        className="py-0 px-1"
      />
      <Button
        variant="outline-primary"
        onClick={addDateButton}
        disabled={!newDate}
        className="py-0 px-1"
      >
        <BsPlus />
      </Button>
    </InputGroup>
  );
}
