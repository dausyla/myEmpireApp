import { Button, Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { useBatch } from "../../contexts/BatchContext/BatchContextHook";
import { useWallet } from "../../contexts/WalletContext/WalletContextHook";

export function AddDateButton() {
  const { addDate } = useBatch();
  const { wallet } = useWallet();
  const [newDate, setNewDate] = useState("");

  if (!wallet) return null;

  const isValid =
    newDate.trim() !== "" && !wallet.dates.some((d) => d.date === newDate);

  const addDateButton = () => {
    if (!isValid) return;

    addDate({ date: newDate, wallet_id: wallet.wallet.id });

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
        disabled={!isValid}
        className="py-0 px-1"
      >
        <BsPlus />
      </Button>
    </InputGroup>
  );
}
