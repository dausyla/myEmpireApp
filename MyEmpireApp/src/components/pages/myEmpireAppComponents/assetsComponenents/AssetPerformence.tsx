import Table from "react-bootstrap/Table";
import { usePortfolio } from "../../../../contexts/PortfolioContext/PortfolioContextHook";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useAssetContext } from "../../../../contexts/AssetContext/AssetContextHook";
import { getAssetPerformence } from "../../../utilies/utilsFunctions";

export function AssetPerformence() {
  const { portfolio, modifyPortfolio } = usePortfolio();
  const { currentAsset } = useAssetContext();

  const countFirstInput = currentAsset?.countFirstInput || false;

  if (!currentAsset || !portfolio) {
    return null;
  }

  const {
    totalValue,
    totalInput,
    totalInterests,
    totalGrowth,
    apy,
    timeSpentInYears,
  } = getAssetPerformence(currentAsset, portfolio.dates);

  const firstInput = currentAsset.inputs.find((v) => v > 0);
  const totalMonthlyInput = countFirstInput
    ? totalInput
    : totalInput - (firstInput || 0);
  const monthlyInput =
    timeSpentInYears === 0
      ? 0
      : Math.round((100 * totalMonthlyInput) / timeSpentInYears / 12) / 100; // Round to 2 decimals

  const toggleCountFirstInput = () => {
    currentAsset.countFirstInput = !countFirstInput;
    modifyPortfolio(portfolio);
  };

  const automateMonthlyApy = () => {
    currentAsset.prediction.estimatedAPY = Math.round(apy * 10000) / 10000; // Round to 2 decimals
    modifyPortfolio(portfolio);
  };
  const automateMonthlyInputs = () => {
    currentAsset.prediction.monthlyInput = monthlyInput;
    modifyPortfolio(portfolio);
  };

  return (
    <>
      <Table hover className="align-middle ">
        <thead className="table-light">
          <tr>
            <th style={{ width: "16.6%", textAlign: "center" }}>Total Value</th>
            <th style={{ width: "16.6%", textAlign: "center" }}>Total Input</th>
            <th style={{ width: "16.6%", textAlign: "center" }}>APY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: "right" }}>{totalValue.toFixed(2)} $</td>
            <td style={{ textAlign: "right" }}>{totalInput.toFixed(2)} $</td>
            <td
              style={{ textAlign: "right" }}
              className={`text-${apy > 0 ? "success" : "danger"}`}
            >
              {(100 * apy).toFixed(2)} %
            </td>
          </tr>
        </tbody>
      </Table>
      <Table hover className="align-middle ">
        <thead className="table-light">
          <tr>
            <th style={{ width: "16.6%", textAlign: "center" }}>
              Monthly Input
            </th>
            <th style={{ width: "16.6%", textAlign: "center" }}>
              Total Interests
            </th>
            <th style={{ width: "16.6%", textAlign: "center" }}>
              Total Growth
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: "right" }}>{monthlyInput} $</td>
            <td
              style={{ textAlign: "right" }}
              className={`text-${totalInterests > 0 ? "success" : "danger"}`}
            >
              {totalInterests.toFixed(2)} $
            </td>
            <td
              style={{ textAlign: "right" }}
              className={`text-${totalGrowth > 0 ? "success" : "danger"}`}
            >
              {(100 * totalGrowth).toFixed(2)} %
            </td>
          </tr>
        </tbody>
      </Table>

      <Container>
        <Row className="mb-2">
          <Form.Check // prettier-ignore
            type="switch"
            value={countFirstInput ? "on" : "false"}
            reverse
            id="custom-switch"
            label="Count first input as a monthly input"
            onChange={() => toggleCountFirstInput()}
          />
        </Row>

        <Row>
          <Col>
            <Button variant="outline-primary" onClick={automateMonthlyInputs}>
              Automate Monthly Inputs
            </Button>
          </Col>
          <Col>
            <Button variant="outline-primary" onClick={automateMonthlyApy}>
              Automate APY
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
