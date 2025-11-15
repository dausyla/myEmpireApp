import { Button, Card, Form } from "react-bootstrap";
import { useState } from "react";
import { useWallet } from "../../../contexts/WalletContext/WalletContextHook";

export function NoWallet() {
  const { createWallet } = useWallet();

  // TODO
  // const [useExample, setUseExample] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleCreate = () => {
    const name = !newName.trim() ? "New Portfolio" : newName;
    const desc = !newDesc.trim() ? "Portfolio Description" : newDesc;
    createWallet(name, desc);
  };

  return (
    <>
      <Card style={{ width: "22rem" }} className="shadow">
        <Card.Body>
          <Card.Title>Create a New Portfolio</Card.Title>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter a name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreate();
                }
              }}
            />

            <Form.Control
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Enter a description"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreate();
                }
              }}
            />

            {/* Option to choose between empty or example portfolio put on the right */}
            {/* <Form.Check
                type="checkbox"
                reverse
                label="Use Example Portfolio"
                className="mt-2"
                style={{ justifyItems: "right" }}
                checked={useExample}
                onChange={() => setUseExample(!useExample)}
              /> */}
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={!newName.trim()}
          >
            Create
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}
