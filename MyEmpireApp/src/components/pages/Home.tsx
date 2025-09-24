import { Container, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
    >
      <Card
        className="p-5 shadow-lg text-center rounded-4"
        style={{ maxWidth: "600px" }}
      >
        <h1 className="fw-bold mb-3">Welcome to MyEmpire</h1>
        <p className="text-muted mb-4">
          Track, analyze, and predict your portfolio performance with ease.
        </p>

        <Button
          size="lg"
          variant="primary"
          className="px-5 py-3 rounded-pill fw-semibold"
          onClick={() => navigate("/app")}
        >
          🚀 Enter Your Empire
        </Button>
      </Card>
    </Container>
  );
}
