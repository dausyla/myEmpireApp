import { Button, Card, Form } from "react-bootstrap";
import { useState } from "react";
import { useBatch } from "../../../../contexts/BatchContext/BatchContextHook";
import { useWallet } from "../../../../contexts/WalletContext/WalletContextHook";
import toast from "react-hot-toast";

export function NoAssetComponent() {
  const { addAsset } = useBatch();
  const { wallet } = useWallet();

  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    const rootDirId = wallet?.dirs[0].id;
    if (!rootDirId) {
      toast.error("No root directory found...");
      return;
    }
    addAsset({
      name: newName,
      dir_id: rootDirId,
      color: "#ff0000",
      estimated_apy: 0,
      // TODO: Remove that
      count_first_input: false,
    });
    setNewName("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Card style={{ width: "22rem" }} className="shadow">
        <Card.Header>No Assets Found</Card.Header>
        <Card.Body>
          <Card.Title>Create a New Asset</Card.Title>
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
