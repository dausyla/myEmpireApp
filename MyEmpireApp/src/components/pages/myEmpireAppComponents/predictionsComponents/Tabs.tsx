import Tab from "react-bootstrap/Tab";
import { Tabs as BSTabs } from "react-bootstrap";
import { Values } from "./tabs/values/Values";
import { Predictions } from "./tabs/predictions/Predictions";

export function Tabs() {
  return (
    <BSTabs variant="tabs" defaultActiveKey="values">
      <Tab eventKey="title" title="Quick Edit" disabled></Tab>
      <Tab eventKey="values" title="Values">
        <Values />
      </Tab>
      <Tab eventKey="predictions" title="Predictions">
        <Predictions />
      </Tab>
    </BSTabs>
  );
}
