import { NavBar } from "../navbar/Navbar";
import { useState } from "react";
import { Predictions } from "./myEmpireAppComponents/Predictions";
import { Assets } from "./myEmpireAppComponents/Assets";
import { usePortfolio } from "../../contexts/PortfolioContext/PortfolioContextHook";
import { Button, Card, Form } from "react-bootstrap";
import { useAppContext } from "../../contexts/AppContext/AppContextHook";

export function MyEmpireApp() {
  const [currentNav, setCurrentNav] = useState("predictions");
  const { portfolio } = usePortfolio();
  const { createNewPortfolioEmpty, createNewPortfolioExample } =
    useAppContext();
  const [useExample, setUseExample] = useState(false);

  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    if (useExample) {
      createNewPortfolioExample(newName.trim());
    } else {
      createNewPortfolioEmpty(newName.trim());
    }
  };

  return (
    <>
      <NavBar setCurrentNav={setCurrentNav} />

      {portfolio ? (
        <>
          {currentNav === "predictions" && <Predictions />}
          {currentNav === "assets" && <Assets />}
        </>
      ) : (
        <>
          <div className="d-flex justify-content-center align-items-center mt-5">
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

                  {/* Option to choose between empty or example portfolio put on the right */}
                  <Form.Check
                    type="checkbox"
                    reverse
                    label="Use Example Portfolio"
                    className="mt-2"
                    style={{ justifyItems: "right" }}
                    checked={useExample}
                    onChange={() => setUseExample(!useExample)}
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
        </>
      )}
    </>
  );
}
