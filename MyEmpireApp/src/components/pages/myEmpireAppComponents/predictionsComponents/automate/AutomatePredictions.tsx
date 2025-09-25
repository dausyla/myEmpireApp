import { Button, Card, Col, Row } from "react-bootstrap";
import { usePortfolio } from "../../../../../contexts/PortfolioContext/PortfolioContextHook";
import { getAssetPerformence } from "../../../../utilies/utilsFunctions";

export function AutomatePredictions() {
  const { portfolio, modifyPortfolio } = usePortfolio();

  if (!portfolio) {
    return null;
  }
  const automateAllApys = () => {
    portfolio.assets.forEach((asset) => {
      const perf = getAssetPerformence(asset, portfolio.dates);
      asset.prediction.estimatedAPY = Math.round(perf.apy * 10000) / 10000; // Round to 2 decimals
    });
    modifyPortfolio(portfolio);
  };

  const automateAllMonthlyInputs = () => {
    portfolio.assets.forEach((asset) => {
      const perf = getAssetPerformence(asset, portfolio.dates);

      const firstInput = asset.inputs.find((v) => v > 0);

      const totalMonthlyInput = asset.countFirstInput
        ? perf.totalInput
        : perf.totalInput - (firstInput || 0);
      const monthlyInput =
        Math.round((100 * totalMonthlyInput) / perf.timeSpentInYears / 12) /
        100; // Round to 2 decimals

      asset.prediction.monthlyInput = monthlyInput;
    });
    modifyPortfolio(portfolio);
  };

  return (
    <Card className="rounded shadow-sm p-2">
      <Row>
        <Col>
          <Button
            variant="outline-primary"
            onClick={() => automateAllMonthlyInputs()}
          >
            <p className="mb-0">Automate All </p>
            <p className="mb-0">Monthly Inputs</p>
          </Button>
        </Col>
        <Col>
          <Button variant="outline-primary" onClick={() => automateAllApys()}>
            <p className="mb-0">Automate All </p>
            <p className="mb-0">APYs</p>
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
