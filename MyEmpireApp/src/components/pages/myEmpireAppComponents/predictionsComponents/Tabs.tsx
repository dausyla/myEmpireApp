import { Card, Nav } from "react-bootstrap";
import { Values } from "./tabs/values/Values";
import { Predictions } from "./tabs/predictions/Predictions";
import { Inputs } from "./tabs/inputs/Inputs";
import { useState } from "react";

type TabType = "values" | "inputs" | "predictions";

export function Tabs() {
  const [activeTab, setActiveTab] = useState<TabType>("values");

  return (
    <Card className="rounded shadow-sm p-2 mb-2" style={{ height: "80%" }}>
      <Card.Header className="bg-white">
        <Nav variant="tabs" activeKey={activeTab} fill>
          <Nav.Item>
            <Nav.Link disabled>Quick Edit</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="values" onClick={() => setActiveTab("values")}>
              Values
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="inputs" onClick={() => setActiveTab("inputs")}>
              Inputs
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="predictions"
              onClick={() => setActiveTab("predictions")}
            >
              Predictions
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body style={{ height: "80%", overflowY: "auto" }}>
        {activeTab === "values" && <Values />}
        {activeTab === "inputs" && <Inputs />}
        {activeTab === "predictions" && <Predictions />}
      </Card.Body>
    </Card>
  );
}
