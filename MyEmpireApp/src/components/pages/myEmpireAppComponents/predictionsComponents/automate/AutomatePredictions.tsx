import { Button, Card, Col, Row } from "react-bootstrap";
import { usePortfolio } from "../../../../../contexts/PortfolioContext/PortfolioContextHook";
import { getAssetPerformence } from "../../../../utilies/utilsFunctions";
import { useAssetContext } from "../../../../../contexts/AssetContext/AssetContextHook";

export function AutomatePredictions() {
  const { portfolio, modifyPortfolio } = usePortfolio();
  const { mapAssets } = useAssetContext();

  if (!portfolio) {
    return null;
  }
  const automateAllApys = () => {
    mapAssets((asset) => {
      const perf = getAssetPerformence(asset, portfolio.dates);
      asset.prediction.estimatedAPY = Math.round(perf.apy * 10000) / 10000; // Round to 2 decimals
    });
    modifyPortfolio(portfolio);
  };

  const automateAllMonthlyInputs = () => {
    mapAssets((asset) => {
      const perf = getAssetPerformence(asset, portfolio.dates);

      const firstInput = asset.inputs.find((v) => v > 0);

      const totalMonthlyInput = asset.countFirstInput
        ? perf.totalInput
        : perf.totalInput - (firstInput || 0);
      const monthlyInput =
        perf.timeSpentInYears === 0
          ? 0
          : Math.round((100 * totalMonthlyInput) / perf.timeSpentInYears / 12) /
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
