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
    <InputGroup style={{ display: "flex", width: "11rem" }}>
      <Form.Control
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
      />
      <Button
        variant="outline-primary"
        onClick={addDateButton}
        disabled={!newDate}
      >
        <BsPlus />
      </Button>
    </InputGroup>
  );
}
