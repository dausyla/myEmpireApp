import { useState } from "react";
import { BsPlus, BsCheck, BsX } from "react-icons/bs";
import "./Utilities.css";
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
    <div className="add-date-wrapper">
      {newDate !== "" ? (
        <div className="editable-edit-container w-100">
          <input
            type="date"
            className="editable-input flex-grow-1"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            autoFocus
          />
          <button
            className="utility-btn success"
            onClick={addDateButton}
            disabled={!isValid}
          >
            <BsCheck />
          </button>
          <button className="utility-btn danger" onClick={() => setNewDate("")}>
            <BsX />
          </button>
        </div>
      ) : (
        <button
          className="add-date-btn"
          onClick={() => {
            const today = new Date().toISOString().split("T")[0];
            setNewDate(today);
          }}
        >
          <BsPlus /> Add Date
        </button>
      )}
    </div>
  );
}
