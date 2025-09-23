import { Button, Card, Form } from "react-bootstrap";
import { useAssetContext } from "../../../../contexts/AssetContext/AssetContextHook";
import { useState } from "react";

export function NoAssetComponent() {
  const { addNewAsset } = useAssetContext();

  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    addNewAsset(newName.trim());
    setNewName("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Card style={{ width: "22rem" }} className="shadow">
        <Card.Header>No Assets Found</Card.Header>
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
    </div>
  );
}
